String.prototype.makeRegexQuery = function (value) {
  const query1 = {};
  query1[this] = { $regex: value, $options: 'i' };
  const query2 = {};
  query2[this] = { $regex: `^${value}$`, $options: 'i' };
  return [query1, query2];
};

String.prototype.toSlug = function () {
  return this.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

String.prototype.capitalized = function () {
  if (this.length > 0) return this[0].toUpperCase() + this.substring(1);
  return this;
};
