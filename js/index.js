window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      count: '',
      codes: '',
      codesArr: [],
      base64Images: [],
      showTips: false
    },
    watch: {
      codes(val) {
        if (val) {
          this.codesArr = val.split('\n').filter((item) => !!item)
          let status = this.codesArr.some((str) =>
            /[\u4e00-\u9fa5]/.test(str)
          )
          this.showTips = status
          if (status) {
            return (this.showTips = true)
          }
          this.$nextTick(() => {
            this.codesArr.forEach((ele, index) => {
              if (ele) {
                JsBarcode(`#barcode${index}`, ele, {
                  height: 80,
                  width: 2,
                  margin: 10,
                  fontSize: 20
                })
              }
            })
          })
        } else {
          this.codesArr = []
        }
      }
    },
    methods: {
      getBase64Image() {
        this.codesArr.forEach((item, index) => {
          let img = document.getElementById(`barcode${index}`)
          if (img) {
            let base64 = img.src.replace('data:image/png;base64,', '')
            this.base64Images.push(base64)
          }
        })
        // 打包下载
        this.zipclick()
      },
      zipclick() {
        var zip = new JSZip()
        // var img = zip.folder('条形码')
        let base64Images = this.base64Images
        let length = base64Images.length
        for (let i = 0; i < length; i++) {
          zip.file(this.codesArr[i] + '.png', base64Images[i], { base64: true })
        }
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          saveAs(content, '条形码.zip')
        })
      }
    }
  })
}
