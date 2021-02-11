// config firebase
var firebaseConfig = {
  apiKey: "AIzaSyDm2ywtqVw_mtMpvEIhnZurLHwstY37k70",
  authDomain: "tc-button.firebaseapp.com",
  databaseURL: "https://tc-button-default-rtdb.firebaseio.com",
  projectId: "tc-button",
  storageBucket: "tc-button.appspot.com",
  messagingSenderId: "1046203280319",
  appId: "1:1046203280319:web:cb5cbaa3c9b179b8d68f0a"
};
// inisialisasi firebase
firebase.initializeApp(firebaseConfig);

var count = 1;
var tableku = $('#data_peserta').DataTable({
  "bDestroy": true,
  responsive: true,
  autoWidth: false,
  info: false,
  lengthChange: false,
  searching: false,
  paging: false,
  "order": [
      [0, "asc"]
  ],
  "columnDefs": [{
          "targets": 0,
          "className": "text-center",
      }
  ],
  columns: [
        { title: "Urutan" },
        { title: "Waktu" },
        { title: "Nama Peserta" }
  ],
  "language": {
    "emptyTable": "Belum ada yang menekan tombol"
  }
});

var databaseRef = firebase.database().ref('data/');

function reload() {
  count = 1
  tableku.clear();

  databaseRef.once('value').then((snapshot) => {
    if (snapshot.val()) {
      console.log('reload baru')
      snapshot.forEach(snap => {
        var dataSet = snap.val();
        var date = new Date(dataSet.timestamp)
        var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds()
   
        tableku.row.add([
          count++,
          time,
          dataSet.name
        ]).draw();
      });
    } else 
      tableku.draw()
  });
}

databaseRef.on("child_added", function (data) {
  var dataSet = data.val();
  var date = new Date(dataSet.timestamp)
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds()
  tableku.row.add([
    count++,
    time,
    dataSet.name
  ]).draw();
});
  
databaseRef.on("child_changed", function(data) {
  reload()
});
  
databaseRef.on("child_removed", function (data) {
  if (data.val().name == $('#nama_peserta').val()) {
    $('#tombol_peserta').text('Push Button')
    $('#tombol_peserta').prop('disabled', false);
  }

  reload()
});

$('#simpan_nama').click(function () {
  var disable = $('#nama_peserta').prop('disabled');
  if (!disable) {
    $('#namaku').text($('#nama_peserta').val())
    $('#input_name').hide()
    $('#content').show()
  } else {
    $('#simpan_nama').text('Simpan Nama')
    $('#nama_peserta').prop('disabled', false);
  }
});

$('#tombol_peserta').click(function () {
  databaseRef.push({
    name: $('#nama_peserta').val(),
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  $('#tombol_peserta').text('Success')
  $('#tombol_peserta').prop('disabled', true);
});

$('#reset').click(function () {
  databaseRef.remove()
  alert('succes')
});