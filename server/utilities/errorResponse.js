module.exports = {
  errorResponse: (e) => {
    let error = e;
    if (!e.errors) {
      error = { errors: [{ msg: e.message }] };
    }
    return error;
  },
};
