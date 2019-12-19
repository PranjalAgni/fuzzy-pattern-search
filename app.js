async function getRedditData() {
  const response = await axios.get(
    'https://www.reddit.com/r/javascript/hot.json?limit=100'
  );

  const titles = response.data.children.map(curr => {
    return curr.data.title;
  });

  return titles;
}

function fuzzy_match(text, search) {
  /**
   * @param {text} Its all the results from API call
   * @param {search} Its the search term, which we are searching for
   *
   * @description Seperate the search term
   * [x] Seperate the search term
   * [x] Set status to false
   * [x] Check for each search word if its there in text
   *
   */

  if (search.length === 0) return true;
  const searchList = search.split(' ');
  console.log('searchList: ', searchList);
  let status = false;
  for (let i = 0; i < searchList.length; i++) {
    const searchWord = searchList[i].toLowerCase();

    if (text.split(new RegExp(searchWord, 'gi')).length > 1) {
      status = true;
      break;
    }
  }

  return status;
}

function fuzzy_match_ii(text, search) {
  /**
   * @param {text} Its all the results from API call
   * @param {search} Its the search term, which we are searching for
   *
   * @description Seperate the search term
   * [x] Seperate the search term
   * [x] Set status to false
   * [x] Check for each search word if its there in text
   *
   */

  let score = 0;
  if (search.length === 0)
    return {
      score,
      status: true
    };
  const searchList = search.trim().split(' ');
  console.log('searchList: ', searchList);
  let status = false;

  for (let i = 0; i < searchList.length; i++) {
    const searchWord = searchList[i];
    score += text.split(new RegExp(searchWord, 'gi')).length - 1;
    if (score > 0) {
      status = true;
    }
  }

  return {
    status,
    score
  };
}

const app = new Vue({
  el: '#app',
  mounted() {
    getRedditData().then(res => {
      this.results = res;
      this.resultsReadOnly = res;
    });
  },
  data: {
    title: 'Fuzzy Search',
    results: [],
    resultsReadOnly: [],
    keyword: ''
  },
  watch: {
    keyword: function(val) {
      let filteredResultsWithScore;
      if (val.length === 0) {
        filteredResultsWithScore = this.resultsReadOnly;
      } else {
        filteredResultsWithScore = this.resultsReadOnly
          .map(result => {
            const time_start = performance.now();
            const { status, score } = fuzzy_match_ii(result, val);
            console.log('Time: ', performance.now() - time_start);
            return {
              result,
              score,
              status
            };
          })
          .filter(res => {
            const { status } = res;

            return status;
          })
          .sort((a, b) => {
            return a.score < b.score ? 1 : -1;
          })
          .map(ans => {
            return ans.result;
          });
      }

      console.log('Final output: ', filteredResultsWithScore);

      this.results = filteredResultsWithScore;
    }
    // keyword: function(val) {
    //   const filteredResults = this.resultsReadOnly.filter(result => {
    //     return fuzzy_match(result, val);
    //   });

    //   console.log('Answer: ', filteredResults);
    //   this.results = filteredResults;
    // }
  }
});
