// Define the autofill function, this behaves like a content script for older manifests.
const autofill = () => {
  const ACCEPTABLE_FUZZY_RATIO = 0.4;

  var FuzzySet = (function () {
    "use strict";

    const FuzzySet = function (
      arr,
      useLevenshtein,
      gramSizeLower,
      gramSizeUpper
    ) {
      var fuzzyset = {};

      // default options
      arr = arr || [];
      fuzzyset.gramSizeLower = gramSizeLower || 2;
      fuzzyset.gramSizeUpper = gramSizeUpper || 3;
      fuzzyset.useLevenshtein =
        typeof useLevenshtein !== "boolean" ? true : useLevenshtein;

      // define all the object functions and attributes
      fuzzyset.exactSet = {};
      fuzzyset.matchDict = {};
      fuzzyset.items = {};

      // helper functions
      var levenshtein = function (str1, str2) {
        var current = [],
          prev,
          value;

        for (var i = 0; i <= str2.length; i++)
          for (var j = 0; j <= str1.length; j++) {
            if (i && j)
              if (str1.charAt(j - 1) === str2.charAt(i - 1)) value = prev;
              else value = Math.min(current[j], current[j - 1], prev) + 1;
            else value = i + j;

            prev = current[j];
            current[j] = value;
          }

        return current.pop();
      };

      // return an edit distance from 0 to 1
      var _distance = function (str1, str2) {
        if (str1 === null && str2 === null)
          throw "Trying to compare two null values";
        if (str1 === null || str2 === null) return 0;
        str1 = String(str1);
        str2 = String(str2);

        var distance = levenshtein(str1, str2);
        if (str1.length > str2.length) {
          return 1 - distance / str1.length;
        } else {
          return 1 - distance / str2.length;
        }
      };
      var _nonWordRe = /[^a-zA-Z0-9\u00C0-\u00FF, ]+/g;

      var _iterateGrams = function (value, gramSize) {
        gramSize = gramSize || 2;
        var simplified =
            "-" + value.toLowerCase().replace(_nonWordRe, "") + "-",
          lenDiff = gramSize - simplified.length,
          results = [];
        if (lenDiff > 0) {
          for (var i = 0; i < lenDiff; ++i) {
            simplified += "-";
          }
        }
        for (var i = 0; i < simplified.length - gramSize + 1; ++i) {
          results.push(simplified.slice(i, i + gramSize));
        }
        return results;
      };

      var _gramCounter = function (value, gramSize) {
        // return an object where key=gram, value=number of occurrences
        gramSize = gramSize || 2;
        var result = {},
          grams = _iterateGrams(value, gramSize),
          i = 0;
        for (i; i < grams.length; ++i) {
          if (grams[i] in result) {
            result[grams[i]] += 1;
          } else {
            result[grams[i]] = 1;
          }
        }
        return result;
      };

      // the main functions
      fuzzyset.get = function (value, defaultValue, minMatchScore) {
        // check for value in set, returning defaultValue or null if none found
        if (minMatchScore === undefined) {
          minMatchScore = 0.33;
        }
        var result = this._get(value, minMatchScore);
        if (!result && typeof defaultValue !== "undefined") {
          return defaultValue;
        }
        return result;
      };

      fuzzyset._get = function (value, minMatchScore) {
        var results = [];
        // start with high gram size and if there are no results, go to lower gram sizes
        for (
          var gramSize = this.gramSizeUpper;
          gramSize >= this.gramSizeLower;
          --gramSize
        ) {
          results = this.__get(value, gramSize, minMatchScore);
          if (results && results.length > 0) {
            return results;
          }
        }
        return null;
      };

      fuzzyset.__get = function (value, gramSize, minMatchScore) {
        var normalizedValue = this._normalizeStr(value),
          matches = {},
          gramCounts = _gramCounter(normalizedValue, gramSize),
          items = this.items[gramSize],
          sumOfSquareGramCounts = 0,
          gram,
          gramCount,
          i,
          index,
          otherGramCount;

        for (gram in gramCounts) {
          gramCount = gramCounts[gram];
          sumOfSquareGramCounts += Math.pow(gramCount, 2);
          if (gram in this.matchDict) {
            for (i = 0; i < this.matchDict[gram].length; ++i) {
              index = this.matchDict[gram][i][0];
              otherGramCount = this.matchDict[gram][i][1];
              if (index in matches) {
                matches[index] += gramCount * otherGramCount;
              } else {
                matches[index] = gramCount * otherGramCount;
              }
            }
          }
        }

        function isEmptyObject(obj) {
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) return false;
          }
          return true;
        }

        if (isEmptyObject(matches)) {
          return null;
        }

        var vectorNormal = Math.sqrt(sumOfSquareGramCounts),
          results = [],
          matchScore;
        // build a results list of [score, str]
        for (var matchIndex in matches) {
          matchScore = matches[matchIndex];
          results.push([
            matchScore / (vectorNormal * items[matchIndex][0]),
            items[matchIndex][1],
          ]);
        }
        var sortDescending = function (a, b) {
          if (a[0] < b[0]) {
            return 1;
          } else if (a[0] > b[0]) {
            return -1;
          } else {
            return 0;
          }
        };
        results.sort(sortDescending);
        if (this.useLevenshtein) {
          var newResults = [],
            endIndex = Math.min(50, results.length);
          // truncate somewhat arbitrarily to 50
          for (var i = 0; i < endIndex; ++i) {
            newResults.push([
              _distance(results[i][1], normalizedValue),
              results[i][1],
            ]);
          }
          results = newResults;
          results.sort(sortDescending);
        }
        newResults = [];
        results.forEach(
          function (scoreWordPair) {
            if (scoreWordPair[0] >= minMatchScore) {
              newResults.push([
                scoreWordPair[0],
                this.exactSet[scoreWordPair[1]],
              ]);
            }
          }.bind(this)
        );
        return newResults;
      };

      fuzzyset.add = function (value) {
        var normalizedValue = this._normalizeStr(value);
        if (normalizedValue in this.exactSet) {
          return false;
        }

        var i = this.gramSizeLower;
        for (i; i < this.gramSizeUpper + 1; ++i) {
          this._add(value, i);
        }
      };

      fuzzyset._add = function (value, gramSize) {
        var normalizedValue = this._normalizeStr(value),
          items = this.items[gramSize] || [],
          index = items.length;

        items.push(0);
        var gramCounts = _gramCounter(normalizedValue, gramSize),
          sumOfSquareGramCounts = 0,
          gram,
          gramCount;
        for (gram in gramCounts) {
          gramCount = gramCounts[gram];
          sumOfSquareGramCounts += Math.pow(gramCount, 2);
          if (gram in this.matchDict) {
            this.matchDict[gram].push([index, gramCount]);
          } else {
            this.matchDict[gram] = [[index, gramCount]];
          }
        }
        var vectorNormal = Math.sqrt(sumOfSquareGramCounts);
        items[index] = [vectorNormal, normalizedValue];
        this.items[gramSize] = items;
        this.exactSet[normalizedValue] = value;
      };

      fuzzyset._normalizeStr = function (str) {
        if (Object.prototype.toString.call(str) !== "[object String]")
          throw "Must use a string as argument to FuzzySet functions";
        return str.toLowerCase();
      };

      // return length of items in set
      fuzzyset.length = function () {
        var count = 0,
          prop;
        for (prop in this.exactSet) {
          if (this.exactSet.hasOwnProperty(prop)) {
            count += 1;
          }
        }
        return count;
      };

      // return is set is empty
      fuzzyset.isEmpty = function () {
        for (var prop in this.exactSet) {
          if (this.exactSet.hasOwnProperty(prop)) {
            return false;
          }
        }
        return true;
      };

      // return list of values loaded into set
      fuzzyset.values = function () {
        var values = [],
          prop;
        for (prop in this.exactSet) {
          if (this.exactSet.hasOwnProperty(prop)) {
            values.push(this.exactSet[prop]);
          }
        }
        return values;
      };

      // initialization
      var i = fuzzyset.gramSizeLower;
      for (i; i < fuzzyset.gramSizeUpper + 1; ++i) {
        fuzzyset.items[i] = [];
      }
      // add all the items to the set
      for (i = 0; i < arr.length; ++i) {
        fuzzyset.add(arr[i]);
      }

      return fuzzyset;
    };

    return FuzzySet;
  })();

  chrome.runtime.onMessage.addListener((state) => {
    // Create a state map to be able to iterate over inputs.
    const stateMap = [
      { id: ["email"], key: FuzzySet(["email"]), value: state.email },
      { id: ["password"], key: FuzzySet(["password"]), value: state.password },
      {
        id: ["first"],
        key: FuzzySet(["first"]),
        value: state.first,
      },
      {
        id: ["last"],
        key: FuzzySet(["last"]),
        value: state.last,
      },
      {
        id: ["cardnumber", "card_number", "creditcard", "credit", "debit"],
        key: FuzzySet(["cardnumber card_number creditcard credit debit"]),
        value: state.card_number,
      },
      {
        id: ["cardcvc", "card_cvc", "cvc", "cvv"],
        key: FuzzySet(["cardcvc card_cvc cvc cvv"]),
        value: state.card_cvc,
      },
      {
        id: ["cardexpiry", "card_expiry", "expiry"],
        key: FuzzySet(["cardexpiry card_expiry expiry"]),
        value: state.card_expiry,
      },
      {
        id: ["street", "addressline1", "line1", "address", "line"],
        key: FuzzySet(["street addressline1 line1 address line"]),
        value: state.street,
      },
      { id: ["city"], key: FuzzySet(["city"]), value: state.city },
      { id: ["country"], key: FuzzySet(["country"]), value: state.country },
      {
        id: ["postcode", "postalcode", "zipcode", "zip", "postal", "post"],
        key: FuzzySet(["postcode postalcode zipcode zip postal post"]),
        value: state.postcode,
      },
      {
        id: ["state", "province"],
        key: FuzzySet(["state province"]),
        value: state.state,
      },
      {
        id: ["phone", "telephone", "tel", "phone_number", "phonenumber"],
        key: FuzzySet(["telephone"]),
        value: state.phone,
      },
    ];
    // Filter to only labels that correspond to a control.
    const inputs = [
      ...document.querySelectorAll("input"),
      ...document.querySelectorAll("select"),
      ...document.querySelectorAll("textarea"),
    ];
    inputs.forEach((input) => {
      const input_id = input?.id?.replace(/[\-\_]/g, " ")?.split(" ");
      const input_classes = input?.className
        ?.replace(/[\-\_]/g, " ")
        ?.split(" ");
      const isInputMatch = stateMap.find((variable) => {
        // A class is part of our search space.
        const isExactClassMatch = input_classes.filter((c) =>
          variable?.id?.includes(c)
        ).length;

        // The ID is part of our search space.
        const isExactIdMatch = input_id.filter((c) => variable?.id?.includes(c))
          .length;

        // These fuzzy ratios represent the accuracy level of the classes, id and name compared to our search space.
        const fuzzyClassRatio = variable?.key?.get(
          input_classes.join` `
        )?.[0]?.[0];
        const fuzzyIdRatio = variable?.key?.get(input_id.join` `)?.[0]?.[0];
        const fuzzyNameRatio = variable?.key?.get(input?.name)?.[0]?.[0];
        // Check if we have a match.
        return (
          isExactClassMatch ||
          isExactIdMatch ||
          fuzzyClassRatio >= ACCEPTABLE_FUZZY_RATIO ||
          fuzzyIdRatio >= ACCEPTABLE_FUZZY_RATIO ||
          fuzzyNameRatio >= ACCEPTABLE_FUZZY_RATIO
        );
      });

      // Don't fill disabled inputs.
      if (!input.disabled) {
        if (isInputMatch) {
          // It's an input field.
          input.value = isInputMatch.value;
          // Create a bubbling event for frontend frameworks to understand that we changed the input and update their state accordingly.
          const newEvent = new Event("input", { bubbles: true });
          input.dispatchEvent(newEvent);
        } else if (input.nodeName === "SELECT") {
          // It's a select. Pick the last value.
          input.selectedIndex = input.length - 1;
        } else if (input.type === "radio" || input.type === "checkbox") {
          // It's a checkbox or radio, click it (this bypasses some weird issues with event bubbling in frontend frameworks).
          input.click();
        }
      }
    });
  });
};

// Listen for messages from the frontend and call autofill.
chrome.runtime.onMessage.addListener((message) => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: autofill,
        });
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  });
});
