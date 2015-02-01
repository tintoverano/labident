Images = new FS.Collection ("patientImages", {
  stores: [new FS.Store.FileSystem ("patientImages", {path: "/opt/cfs/labident/images"})],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

Files = new FS.Collection ("patientFiles", {
  stores: [new FS.Store.FileSystem ("patientFiles", {path: "/opt/cfs/labident/files"})],
  filter: {
    deny: {
      contentTypes: ['image/*']
    }
  }
});

Images.allow ({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    //return (userId && doc.owner === userId);
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    //return doc.owner === userId;
    return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    //return doc.owner === userId;
    return false;
  }
});

Files.allow ({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    //return (userId && doc.owner === userId);
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    //return doc.owner === userId;
    return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    //return doc.owner === userId;
    return false;
  }
});
