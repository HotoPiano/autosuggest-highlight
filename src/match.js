var removeDiacritics = require('diacritic').clean;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
var specialCharsRegex = /[.*+?^${}()|[\]\\]/g;

var whitespacesRegex = /\s+/;

function escapeRegexCharacters(str) {
  return str.replace(specialCharsRegex, '\\$&');
}

module.exports = function match(text, query) {
  text = removeDiacritics(text);
  query = removeDiacritics(query);

  return (
    query
      .trim()
      .split(whitespacesRegex)
      // If query is blank, we'll get empty string here, so let's filter it out.
      .filter(function(word) {
        return word.length > 0;
      })
      .reduce(function(result, word) {
        var wordLen = word.length;
        var regex = new RegExp(escapeRegexCharacters(word), 'i');
        var index = text.search(regex);

        if (index > -1) {
          result.push([index, index + wordLen]);

          // Replace what we just found with spaces so we don't find it again.
          text =
            text.slice(0, index) +
            new Array(wordLen + 1).join(' ') +
            text.slice(index + wordLen);
        }

        return result;
      }, [])
      .sort(function(match1, match2) {
        return match1[0] - match2[0];
      })
  );
};
