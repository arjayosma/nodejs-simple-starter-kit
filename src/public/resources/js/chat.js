$(document).ready(function () {
  window.acquire = window.acquire || []
  var element = null
  var prevElement = null
  var fileUploadForm = null
  var textArea = null
  // var sendButton = null
  var tableRow = null
  var loading = null
  // var keys = []
  var selectedIndex = []
  var selectedKeys = []
  var uploadFormDisplay = false
  var allowedTypes = 'application/pdf,image/png,image/jpeg,image/gif'
  var uploadButton = `<div id="lblUpload"><img class="attach-click" src="https://s.acquire.io/asset/chat-widget/attach-new@2x.png" width="20" height="20" /></div>`
  var uploadForm = `<div id="uploadForm" class="upload-form" style="display: none;width: 100%; position: relative; background-color: #FFFFFF; border-top-left-radius: 20px;border-top-right-radius: 20px; padding: 10px 20px 10px 20px; box-shadow: 0px -3px 5px #dddddd;"><input style="display:none;" type="file" name="clientFile" id="fileUploadForm" accept="${allowedTypes}" /><label for="fileUploadForm" class="button-file-upload upload-item" style="cursor: pointer;width: 60px; height: 60px; background-color: #eeeeee; border: 3px dashed #cccccc;text-align: center; border-radius: 20px; font-size: 32px;color: #cccccc; font-weight: bold; padding: 5px 0; margin-right: 10px; display: inline-block;margin-top: 10px" title="Select File to Upload">+</div></div>`
  var uploadItem = `<div class="upload-item file" style="cursor: pointer;width: 60px; height: 60px; background-color: #eeeeee; border: 3px dashed #cccccc;text-align: center; border-radius: 20px; font-size: 32px;color: #cccccc; font-weight: bold; padding: 5px 0; margin-right: 10px; display: inline-block;margin-top: 10px"></div>`
  var load = function () {
    var script = 'https://s.acquire.io/a-30eb8/init.js?full'
    var x = document.createElement('script')
    x.src = script
    x.async = true
    var sx = document.getElementsByTagName('script')[0]
    sx.parentNode.insertBefore(x, sx)
  }

  if (document.readyState === 'complete') {
    load()
  } else if (window.addEventListener) {
    window.addEventListener('load', load, false)
  } else if (window.attachEvent) {
    window.attachEvent('onload', load)
  }

  window.acquire.push(function (app) {
    var loader = setInterval(function () {
      element = app.ui.document.getElementsByClassName('button-attach-opener')
      loading = app.ui.document.getElementsByClassName('tw_loading')[0]
      tableRow = app.ui.document.getElementsByClassName(
        'wrapper-table-row onbotton'
      )

      if (element.length) {
        prevElement = app.ui.document.getElementsByClassName(
          'button-emoji-opener'
        )
        // sendButton = app.ui.document.getElementsByClassName('send-btn')[0]
        textArea = app.ui.document.getElementsByClassName('textarea')[0]
        clearInterval(loader)
        element[0].remove()
        tableRow[0].insertAdjacentHTML('afterbegin', uploadForm)
        prevElement[0].insertAdjacentHTML('afterend', uploadButton)
        $($(app.ui.document.getElementsByClassName('attach-click')[0])).click(
          function (e) {
            uploadFormDisplay = !uploadFormDisplay
            $(app.ui.document.getElementsByClassName('upload-form')).css(
              'display',
              uploadFormDisplay ? 'block' : 'none'
            )
          }
        )
        fileUploadForm = app.ui.document.getElementById('fileUploadForm')
        $(fileUploadForm).change(function () {
          if (this.files.length) {
            console.log(`Uploading file: ${this.files[0].name} (${this.files[0].type})`)
            var formData = new FormData()
            formData.append('clientFile', this.files[0])
            var item = app.ui.document.getElementsByClassName('upload-item')
            item[item.length - 1].insertAdjacentHTML('afterend', uploadItem)
            item = app.ui.document.getElementsByClassName('upload-item')
            $(item[item.length - 1]).html(loading.cloneNode(true)).attr('title', this.files[0].name)

            $.ajax({
              url: '/upload',
              type: 'POST',
              data: formData,
              contentType: false,
              processData: false,
              dataType: 'json',
              success: function (data) {
                console.log('File upload success!')
                selectedIndex.push(item.length - 1)
                selectedKeys.push(data.results.key)
                $(item[item.length - 1]).html(item.length - 1).attr('data-index', item.length - 1).attr('data-key', data.results.key).css('color', '#3498db').css('border-color', '#3498db')
                $(item[item.length - 1]).click(function (e) {
                  var index = $(this).index() - 1
                  var key = $(this).attr('data-key')

                  if (selectedIndex.includes(index)) {
                    selectedIndex.pop(index)
                    selectedKeys.splice(selectedKeys.indexOf(key), 1)
                    $(this).css('color', '#cccccc').css('border-color', '#cccccc')
                  } else {
                    selectedIndex.push(index)
                    selectedKeys.push(key)
                    $(this).css('color', '#3498db').css('border-color', '#3498db')
                  }

                  if (selectedKeys.length) {
                    $(textArea).val(`Files: [${selectedKeys.join(', ')}]`)
                  } else {
                    $(textArea).val('')
                  }
                })
                $(textArea).val(`Files: [${selectedKeys.join(', ')}]`)
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.error('An error has occurred.')
                console.error('XHR', jqXHR)
                console.error('Status', textStatus)
                console.error('Error', errorThrown)
              }
            })
          }
        })
      }
    }, 1000)
  })
})
