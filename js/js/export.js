var loading = false;
function excelExport(url,filename) {
    if(loading) return;
    loading = true;
    $('.export').attr('disabled','disabled');
    $('.export').addClass('layui-btn-disabled');
    $('.export').html('导出中');
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);        // 也可以使用POST方式，根据接口

    xhr.responseType = "blob";    // 返回类型blob

    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑

    xhr.onload = function (res) {
        // 请求完成

        var blob = this.response;

        var reader = new FileReader();

        reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href

        reader.onload = function (e) {
            console.log(e);
            // 转换完成，创建一个a标签用于下载

            var a = document.createElement('a');

            a.download = filename+'.xlsx';

            a.href = e.target.result;

            $("body").append(a);    // 修复firefox中无法触发click

            a.click();

            $(a).remove();
            loading = false;
            $('.export').removeAttr('disabled');
            $('.export').removeClass('layui-btn-disabled');
            $('.export').html('导出');
        }

    };
    // 发送ajax请求
    xhr.send()
}