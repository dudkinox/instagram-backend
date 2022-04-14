class PostModel {
  constructor(id, name, email, list) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.list = list;
  }
}

class listPostModel {
  constructor(id, list) {
    this.id = id;
    this.list = list;
  }
}

module.exports = listPostModel;
module.exports = PostModel;
