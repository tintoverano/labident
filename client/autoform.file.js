var clearFilesFromSession, getCollection, getIcon, getTemplate, refreshFileInput, processImage;
AutoForm.addInputType('fileUpload', {
  template: 'afFileUpload'
});
refreshFileInput = function(name) {
  var callback;
  callback = function() {
    var value;
    value = $('input[name="' + name + '"]').val();
    return Session.set('fileUpload[' + name + ']', value);
  };
  return setTimeout(callback, 10);
};
getIcon = function(file) {
  var icon;
  if (file) {
    file = file.toLowerCase();
    icon = 'file-o';
    if (file.indexOf('youtube.com') > -1) {
      icon = 'youtube';
    } else if (file.indexOf('vimeo.com') > -1) {
      icon = 'vimeo-square';
    } else if (file.indexOf('.pdf') > -1) {
      icon = 'file-pdf-o';
    } else if (file.indexOf('.doc') > -1 || file.indexOf('.docx') > -1) {
      icon = 'file-word-o';
    } else if (file.indexOf('.ppt') > -1) {
      icon = 'file-powerpoint-o';
    } else if (file.indexOf('.avi') > -1 || file.indexOf('.mov') > -1 || file.indexOf('.mp4') > -1) {
      icon = 'file-movie-o';
    } else if (file.indexOf('.png') > -1 || file.indexOf('.jpg') > -1 || file.indexOf('.gif') > -1 || file.indexOf('.bmp') > -1) {
      icon = 'file-image-o';
    } else if (file.indexOf('http://') > -1 || file.indexOf('https://') > -1) {
      icon = 'link';
    }
    return icon;
  }
};
getTemplate = function(file) {
  var template;
  file = file.toLowerCase();
  template = 'fileThumbIcon';
  if (file.indexOf('.jpg') > -1 || file.indexOf('.png') > -1 || file.indexOf('.gif') > -1) {
    template = 'fileThumbImg';
  }
  return template;
};
clearFilesFromSession = function() {
  return _.each(Session.keys, function(value, key, index) {
    if (key.indexOf('fileUpload') > -1) {
      return Session.set(key, '');
    }
  });
};
getCollection = function(context) {
  if (typeof context.atts.collection === 'string') {
    context.atts.collection = FS._collections[context.atts.collection] || window[context.atts.collection];
  }
  return context.atts.collection;
};
processImage = function(imageFile, maxWidth, maxHeight, callback) {
  var canvas, ctx, img, url;
  canvas = document.createElement('canvas');
  ctx = canvas.getContext("2d");
  img = new Image();
  url = (window.URL ? window.URL : window.webkitURL);
  img.src = url.createObjectURL(imageFile);
  return img.onload = function(e) {
    var binaryReader, height, width;
    url.revokeObjectURL(this.src);
    width = void 0;
    height = void 0;
    binaryReader = new FileReader();
    binaryReader.onloadend = function(d) {
      var b, data, exif, g, i, pixels, px, py, r, transform, _ref, _ref2;
      exif = void 0;
      transform = "none";
      exif = EXIF.readFromBinaryFile(d.target.result);
      if (exif.Orientation === 8) {
        width = img.height;
        height = img.width;
        transform = "left";
      } else if (exif.Orientation === 6) {
        width = img.height;
        height = img.width;
        transform = "right";
      } else if (exif.Orientation === 1) {
        width = img.width;
        height = img.height;
      } else if (exif.Orientation === 3) {
        width = img.width;
        height = img.height;
        transform = "flip";
      } else {
        width = img.width;
        height = img.height;
      }
      if (width / maxWidth > height / maxHeight) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (transform === "left") {
        ctx.setTransform(0, -1, 1, 0, 0, height);
        ctx.drawImage(img, 0, 0, height, width);
      } else if (transform === "right") {
        ctx.setTransform(0, 1, -1, 0, width, 0);
        ctx.drawImage(img, 0, 0, height, width);
      } else if (transform === "flip") {
        ctx.setTransform(1, 0, 0, -1, 0, height);
        ctx.drawImage(img, 0, 0, width, height);
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(img, 0, 0, width, height);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      r = void 0;
      g = void 0;
      b = void 0;
      i = void 0;
      py = 0;
      for (py = 0, _ref = pixels.height; 0 <= _ref ? py < _ref : py > _ref; 0 <= _ref ? py++ : py--) {
        for (px = 0, _ref2 = pixels.width; 0 <= _ref2 ? px < _ref2 : px > _ref2; 0 <= _ref2 ? px++ : px--) {
          i = (py * pixels.width + px) * 4;
          r = pixels.data[i];
          g = pixels.data[i + 1];
          b = pixels.data[i + 2];
          if (g > 100 && g > r * 1.35 && g > b * 1.6) {
            pixels.data[i + 3] = 0;
          }
        }
      }
      ctx.putImageData(pixels, 0, 0);
      data = canvas.toDataURL("image/png");
      return callback(data);
    };
    return binaryReader.readAsArrayBuffer(imageFile);
  };
};
AutoForm.addHooks(null, {
  onSuccess: function() {
    return clearFilesFromSession();
  }
});
Template.afFileUpload.destroyed = function() {
  var name;
  name = this.data.name;
  return Session.set('fileUpload[' + name + ']', null);
};
Template.afFileUpload.events({
  "change .file-upload": function(e, t) {
    var files;
    files = e.target.files;
    if (files[0].type.indexOf ("image") > -1) {
      return data = processImage(files[0], 600, 600, function (data) {
        var collection, img;
        img = new FS.File(data);
        img.name(files[0].name);
        collection = getCollection(t.data);
        return collection.insert(img, function (err, fileObj) {
          var name;
          if (err) {
            return console.log(err);
          } else {
            name = $(e.target).attr('file-input');
            $('input[name="' + name + '"]').val(fileObj._id);
            Session.set('fileUploadSelected[' + name + ']', files[0].name);
            return refreshFileInput(name);
          }
        });
      });
    }
    else {
      var collection;
      collection = getCollection(t.data);
      return collection.insert(files[0], function (err, fileObj) {
        var name;
        if (err) {
          return console.log(err);
        } else {
          name = $(e.target).attr('file-input');
          $('input[name="' + name + '"]').val(fileObj._id);
          Session.set('fileUploadSelected[' + name + ']', files[0].name);
          return refreshFileInput(name);
        }
      });
    }
  },
  'click .file-upload-clear': function(e, t) {
    var name;
    name = $(e.currentTarget).attr('file-input');
    $('input[name="' + name + '"]').val('');
    return Session.set('fileUpload[' + name + ']', 'delete-file');
  }
});
Template.afFileUpload.helpers({
  collection: function() {
    return getCollection(this);
  },
  label: function() {
    return this.atts.label || 'Choose file';
  },
  removeLabel: function() {
    return this.atts['remove-label'] || 'Remove';
  },
  fileUploadAtts: function() {
    var atts;
    atts = _.clone(this.atts);
    delete atts.collection;
    return atts;
  },
  fileUpload: function() {
    var af, collection, doc, file, filename, name, obj, src;
    af = Template.parentData(1)._af;
    name = this.atts.name;
    collection = getCollection(this);
    if (af && af.submitType === 'insert') {
      doc = af.doc;
    }
    if (Session.equals('fileUpload[' + name + ']', 'delete-file')) {
      return null;
    } else if (Session.get('fileUpload[' + name + ']')) {
      file = Session.get('fileUpload[' + name + ']');
    } else if (Template.parentData(4).value) {
      file = Template.parentData(4).value;
    } else {
      return null;
    }
    if (file !== '' && file) {
      if (file.length === 17) {
        if (collection.findOne({
            _id: file
          })) {
          filename = collection.findOne({
            _id: file
          }).name();
          src = collection.findOne({
            _id: file
          }).url();
        } else {
          filename = Session.get('fileUploadSelected[' + name + ']');
          obj = {
            template: 'fileThumbIcon',
            data: {
              src: filename,
              icon: getIcon(filename)
            }
          };
          return obj;
        }
      } else {
        filename = file;
        src = filename;
      }
    }
    if (filename) {
      obj = {
        template: getTemplate(filename),
        data: {
          src: src,
          icon: getIcon(filename)
        }
      };
      return obj;
    }
  },
  fileUploadSelected: function(name) {
    return Session.get('fileUploadSelected[' + name + ']');
  },
  isUploaded: function(name, collection) {
    var doc, file, isUploaded;
    file = Session.get('fileUpload[' + name + ']');
    isUploaded = false;
    if (file && file.length === 17) {
      doc = window[collection].findOne({
        _id: file
      });
      isUploaded = doc.isUploaded();
    } else {
      isUploaded = true;
    }
    return isUploaded;
  },
  getFileByName: function(name, collection) {
    var doc, file;
    file = Session.get('fileUpload[' + name + ']');
    if (file && file.length === 17) {
      doc = window[collection].findOne({
        _id: file
      });
      console.log(doc);
      return doc;
    } else {
      return null;
    }
  }
});