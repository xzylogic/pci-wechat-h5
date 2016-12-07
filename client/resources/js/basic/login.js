$(".form-container").Validform({
  tiptype: 3,
  postonce: true,
  datatype: {
    "phone": /^1[3|4|5|7|8][0-9]\d{8}$/
  }
});
