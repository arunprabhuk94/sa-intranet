const iconColors = ["#3BC163", "#9963C9", "#FF664E"];

module.exports = {
  getRandomColor: () => {
    const randColorIndex = Math.floor(Math.random() * iconColors.length);
    const randomColor = iconColors[randColorIndex];
    return randomColor;
  },
  getSearchType: (searchText) => {
    const searchTypeParts = searchText.split(":");
    let searchType = "subject";
    const availableSearchTypes = ["subject", "description", "name", "email"];
    let searchString = searchText;
    if (searchTypeParts[1]) {
      searchType =
        availableSearchTypes.find((type) =>
          type.includes(searchTypeParts[0])
        ) || searchType;
      searchString = searchTypeParts[1];
    }
    return { searchType, searchString };
  },
  capitalize: (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
      match.toUpperCase()
    ),
};
