window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      count: '',
      codes: '',
      codesArr: [],
      base64Images: [],
      showTips: false,
      orderNo: '',
      qrcodeList: []
    },
    watch: {
      codes(val) {
        if (val) {
          this.codesArr = val.split('\n').filter((item) => !!item)
          let status = this.codesArr.some((str) => /[\u4e00-\u9fa5]/.test(str))
          this.showTips = status
          if (status) {
            return (this.showTips = true)
          }
          this.$nextTick(() => {
            this.codesArr.forEach((ele, index) => {
              if (ele) {
                let child = document.getElementById(`barcode${index}`).children
                  .length
                if (child) {
                  this.qrcodeList[index].makeCode(ele)
                } else {
                  let qrcode = new QRCode(`barcode${index}`, {
                    text: ele,
                    width: 128,
                    height: 128,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                  })
                  this.qrcodeList[index] = qrcode
                }
              }
            })
          })
        } else {
          this.codesArr = []
        }
      },
      base64Images(val) {
        if (val) {
          if (val.length === this.codesArr.length) {
            this.loading = false
            // 打包下载
            this.zipclick()
          }
        }
      }
    },
    methods: {
      getBase64Image() {
        this.loading = true
        this.codesArr.forEach((item, index) => {
          let dom = document.getElementById(`qrcode${index}`)
          if (dom) {
            html2canvas(dom).then((canvas) => {
              this.base64Images.push(
                canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '')
              )
            })
          }
        })
      },
      zipclick() {
        var zip = new JSZip()
        // var img = zip.folder('二维码')
        let base64Images = this.base64Images
        let length = base64Images.length
        for (let i = 0; i < length; i++) {
          zip.file(this.codesArr[i] + '.png', base64Images[i], { base64: true })
        }
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          saveAs(content, '二维码.zip')
        })
      }
    }
  })
}
