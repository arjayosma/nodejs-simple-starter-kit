$(document).ready(function () {
  $('#txtFileKey').keyup(function (element) {
    var key = element.target.value
    $.ajax({
      url: '/files',
      type: 'GET',
      data: { key: key },
      success: function (data) {
        console.log('File search success!')
        console.log('Result', data)
        let result = ''
        console.log(data.result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }))
        data.result.sort(function (a, b) {
          return b.createdAt - a.createdAt
        }).forEach(function (entry) {
          const date = new Date(entry.createdAt)
          result += `<li class="list-group-item">
          <h5 id="${entry.key}" class="card-title">${entry.filename}</h5>
          <h6 class="card-subtitle mb-2 text-muted">
          Uploaded on: ${date.getMonth() +
            1}/${date.getDate()}/${date.getFullYear()} @ ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}</h6>
          <a href="${entry.url}" class="btn btn-success">
            Download ${entry.filename}
          </a>
        </li>`
        })
        $('#fileResults').html(result)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('An error has occurred.')
        console.error('XHR', jqXHR)
        console.error('Status', textStatus)
        console.error('Error', errorThrown)
      }
    })
  })
})
