$(document).ready(function () {
    //证据类
    var Evidence = function (data) {
        this.id = data.id;
        this.name = data.name;
        this.url = data.url;
        this.type = data.type;
        this.suggest = data.suggest;
        //状态 "未审核" "通过" "未通过"
        this.state = data.state;
        //不通过的备注
        this.remarks = [];
        //不通过的临时备注
        this._remarks = [];
        //通过的备注
        this.pass_remark = "";
        //备注配置的每项是否展开
        this.is_unfold = [];
    }
    //在列表中显示
    Evidence.prototype.list_item_show = function (index) {
        return '<tr><td>' + this.name + '</td><td>' + Evidence.state2color(this.state) + '</td><td><a class="check" data-index="' + index + '" target="_blank" data-toggle="modal" data-target="#myModal">审核</a></td></tr>'
    }
    //备注
    Evidence.prototype.remark_text = function () {
        var text = "";
        this.remarks.forEach(function (v, k) {
            var children = [];
            (v.children || []).forEach(function (v) {
                children.push(v.text);
            });
            k++;
            text += (k + "、" + v.text + "：");
            text += (children.join("、") + "；");
        });
        return text;
    }
    //证据显示
    Evidence.prototype.show = function (index, state, cb) {
        var self = this;
        function img_show() {
            if (state) {
                index++;
                self.state = state
            }
            var imgs = $(".img-show").children();
            imgs.hide();
            $(imgs[index]).show();
            cb && cb();
        }
        if (state === "未通过") {
            self.notpass_remark_show(function () {
                img_show();
            });
        } else {
            img_show();
        }
    }
    //不通过时
    Evidence.prototype.notpass_remark_show = function (cb) {
        this.notpass_remark_left_show();
        this.notpass_remark_right_show();
        var close = $("#notpass-close"),
            ok = $("#notpass-ok"),
            notpass = $("#notpassModal");
        var self = this;
        close.off(), ok.off();
        close.on("click", function () {
            notpass.hide();
            self._remarks = JSON.parse(JSON.stringify(self.remarks));
        });
        ok.on("click", function () {
            notpass.hide();
            self.remarks = JSON.parse(JSON.stringify(self._remarks));
            if (self.remarks.length > 0) {
                cb();
            }
        });
        notpass.show();
    }
    Evidence.prototype.notpass_remark_left_show = function (cb) {
        var config = Evidence.remarks_config;
        var html = "";
        var remarks = this._remarks;
        var self = this;
        function getChecked(oneText, twoText) {
            var oneIndex = remarks.length;
            while (oneIndex--) {
                if (oneText === remarks[oneIndex].text) {
                    var twoIndex = remarks[oneIndex].children.length;
                    while (twoIndex--) {
                        if (twoText === remarks[oneIndex].children[twoIndex].text) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        function getCh(data, one) {
            var config = data.children;
            var ul = '';
            config.forEach(function (v, k) {
                var checked = getChecked(data.text, v.text);
                ul += '<li><label><input type="checkbox" ' + (checked ? "checked=true" : "") + ' data-one="' + one + '" data-two="' + k + '"> ' + v.text + '</label></li>'
            });
            return '<ul class="ul-default" style="display: ' + (self.is_unfold[one] ? "block" : "none") + '">' + ul + '</ul>';
        }
        function getText(text, one) {
            var type = self.is_unfold[one] ? "minus" : "plus";
            return '<span class="config-item" data-one="' + one + '"><span class="glyphicon glyphicon-' + type + '"></span>' + text + '</span>'
        }
        config.forEach(function (v, k) {
            var ul = v.children && v.children.length > 0 ? getCh(v, k) : "";
            html += '<li>' + getText(v.text, k) + ul + '</li>'
        });
        function up_down(target) {
            var up = "glyphicon glyphicon-plus";
            var down = "glyphicon glyphicon-minus";
            var icon = $(target).children("span");
            var content = $(target).next();
            var index = $(target).attr("data-one");
            if (icon.attr("class") === up) {
                icon.attr("class", down);
                content.show();
                self.is_unfold[index] = true;
            } else {
                icon.attr("class", up);
                content.hide();
                self.is_unfold[index] = false;
            }
        }
        $(".config").html(html);
        $(".config-item").on("click", function (e) {
            up_down(e.target);
        });
        $(".config-item span").on("click", function (e) {
            up_down($(e.target).parent()[0]);
        });
        var input = $(".config input");
        input.off();
        input.change(function (e) {
            self.left2right(e);
        });
    }
    //右边的备注映射到左边
    Evidence.prototype.left2right = function (e) {
        var self = this;
        var remarks = self._remarks;
        var config = Evidence.remarks_config;
        var one = $(e.target).attr("data-one");
        var two = $(e.target).attr("data-two");
        function config2remarks() {
            var len = remarks.length;
            while (len--) {
                if (remarks[len].text === config[one].text) {
                    remarks[len].isSystem = true;
                    var index = remarks[len].children.length;
                    while (index--) {
                        if (remarks[len].children[index].text === config[one].children[two].text) {
                            if (!e.target.checked) {
                                remarks[len].children.splice(index, 1);
                            }
                            return remarks
                        }
                    }
                    if (e.target.checked) {
                        remarks[len].children.push(config[one].children[two]);
                        return remarks
                    }
                }
            }
            if (e.target.checked) {
                remarks.push({ text: config[one].text, children: [config[one].children[two]], isSystem: true });
            }
            return remarks
        }
        console.log(e);
        self._remarks = config2remarks();
        self.notpass_remark_right_show();
    }
    //不通过时右边更新
    Evidence.prototype.notpass_remark_right_show = function () {
        var self = this;
        var html = '';
        function getText(text) {
            return '<div style="float: left;">' + text + '</div>'
        }
        function getClose(one, two) {
            return '<div class="close" data-one="' + one + '" data-two="' + two + '">x</div>';
        }
        function getAddInput(one) {
            return '<div type="button" class="btn btn-default add" data-one="' + one + '">+</div><input type="text" data-one="' + one + '" style="display: none"/>';
        }
        function getCh(children, one) {
            var ul = '<ul class="ul-default">';
            children.forEach(function (v, k) {
                ul += '<li>' + getText(v.text) + getClose(one, k) + '</li>'
            });
            ul += (getAddInput(one) + '</ul>');
            return ul;
        }
        this._remarks.forEach(function (v, k) {
            html += ('<li>' + getText(v.text) + getClose(k, -1) + getCh(v.children, k) + '</li>');
        })
        html += getAddInput(-1);
        html += (this._remarks.length === 0 ? '<div class="remark-tips">审核不通过时，请输入备注！</div>' : "");
        $(".notpass-remark").html(html);

        var close = $(".notpass-remark .close"),
            add = $(".notpass-remark .add"),
            input = $(".notpass-remark input");
        add.show();
        input.hide();
        close.off(), add.off();
        close.on("click", function (e) {
            console.log(e);
            var one = $(e.target).attr("data-one");
            var two = $(e.target).attr("data-two");
            if (two > -1) {
                self._remarks[one].children.splice(two, 1);
            } else {
                self._remarks.splice(one, 1);
            }
            self.notpass_remark_left_show();
            self.notpass_remark_right_show();
        });
        add.on("click", function (e) {
            console.log(e);
            var currentAdd = $(e.target);
            var one = currentAdd.attr("data-one");
            var input = currentAdd.next();
            input.off();
            currentAdd.hide();
            input.show();
            input.focus();
            input.on("blur", function (e) {
                if (e.target.value.trim()) {
                    if (one > -1) {
                        self._remarks[one].children.push({ text: e.target.value });
                    } else {
                        self._remarks.push({ text: e.target.value, children: [] });
                    }
                    self.notpass_remark_left_show();
                    self.notpass_remark_right_show();
                }
                currentAdd.show();
                input.hide();
            });
        })
    }
    //静态方法 状态对应的颜色
    Evidence.state2color = function (state) {
        var color = state === "未通过" ? "red" : state === "通过" ? "green" : "";
        return '<span style="color:' + color + '">' + state + '</span>'
    }
    //静态方法 更新审核结果
    Evidence.result_show = function (evidences, callback) {
        var table_html = "", //证据列表
            remarks_text = "";//全部证据备注
        var state = "通过";//审核结果
        var remark_array = [];
        evidences.forEach(function (v, k) {
            table_html += v.list_item_show(k);
            var remark_text = v.state === "未通过" ? v.remark_text() : v.state === "通过" ? v.pass_remark : "";
            remark_text = remark_text ? (v.name + "：" + remark_text + "<br/>") : "";
            remarks_text += remark_text;
            if (state !== "未审核") {
                if (v.state === "未通过") state = "未通过";
                if (v.state === "未审核") state = "未审核";
            }
            v.remarks.length > 0 && remark_array.push({
                id: v.id,
                name: v.name,
                remarks: v.remarks
            });
        });
        $("#evidence-list").html(table_html);
        $(".remark").html(remarks_text);
        $("#case-state").html("审核结果：" + Evidence.state2color(state));
        var submitBtn = $(".btn-submit");
        if (state !== "未审核") {
            submitBtn.removeAttr("disabled");
        } else {
            submitBtn.attr("disabled", "disabled");
        }
        console.log(remark_array);
        submitBtn.off();
        submitBtn.on("click", function () {
            var describe = $(".remark-input").val();
            if (describe) {
                remark_array.push({
                    id: 0,
                    name: '0',
                    remarks: [{ text: describe, children: [] }]
                });
            }
            callback && callback({
                state: state,
                remark: remarks_text + describe,
                remark_array: JSON.stringify(remark_array)
            });
        });
        var checkBtns = $(".check"),
            prev = $("#prev"),
            passNext = $("#pass-next"),
            notpassNext = $("#notpass-next");
        checkBtns.off();
        var index = 0;
        checkBtns.on("click", function (e) {
            index = Number($(e.target).attr("data-index"));
            evidences[index].show(index);
        });
        prev.off(), passNext.off(), notpassNext.off();
        prev.on("click", function () {
            if (index > 0) {
                index--;
                evidences[index].show(index);
            }
        });
        passNext.on("click", function () {
            evidences[index].show(index, "通过", function () {
                next();
            });
        });
        notpassNext.on("click", function () {
            evidences[index].show(index, "未通过", function () {
                next();
            });
        });
        function next() {
            if (index < evidences.length - 1) {
                index++;
            } else if (index === evidences.length - 1) {
                $('#myModal').modal('hide');
            }
        }
    }
    //静态方法 显示备注配置
    Evidence.remark_config_show = function () {
        var config = Evidence.remarks_config;
        var html = "";
        function getCh(data, one) {
            var config = data.children;
            var ul = '<ul class="ul-default" style="display: none">';
            config.forEach(function (v, k) {
                var checked = false;
                ul += '<li><label><input type="checkbox" ' + (checked ? "checked=true" : "") + ' data-one="' + one + '" data-two="' + k + '"> ' + v.text + '</label></li>'
            });
            ul += '</ul>';
            return ul;
        }
        function getText(text) {
            return '<span class="config-item"><span class="glyphicon glyphicon-plus"></span>' + text + '</span>'
        }
        config.forEach(function (v, k) {
            var ul = v.children && v.children.length > 0 ? getCh(v, k) : "";
            html += '<li>' + getText(v.text) + ul + '</li>'
        });
        function up_down(target) {
            var up = "glyphicon glyphicon-plus";
            var down = "glyphicon glyphicon-minus";
            var icon = $(target).children("span");
            var content = $(target).next();
            if (icon.attr("class") === up) {
                icon.attr("class", down);
                content.show();
            } else {
                icon.attr("class", up);
                content.hide();
            }
        }
        $(".config").html(html);
        $(".config-item").on("click", function (e) {
            up_down(e.target);
        });
        $(".config-item span").on("click", function (e) {
            up_down($(e.target).parent()[0]);
        })
    }
    //静态方法 提前加载所有图像资源
    Evidence.evidence_img_init = function (evidences) {
        var imgHtml = "";
        function blobGet(url, cb) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    var blob = this.response;
                    cb(window.URL.createObjectURL(blob));
                }
            }
            xhr.send();
        }
        evidences.forEach(function (v, k) {
            var suggest = v.suggest ? '<p>系统建议：' + v.suggest + '</p>' : '';
            if (v.type === "pdf") {
                imgHtml += ('<div class="pdf" data-url="' + v.url + '">' + suggest + '</div>');
                // imgHtml += ('<div><object data="' + v.url + '" type="application/pdf"></object>' + suggest + '</div>');
            } else {
                imgHtml += ('<div class="img-scroll"><img src="' + v.url + '" alt="">' + suggest + '</div>');
            }
        });
        $(".img-show").html(imgHtml);
        $(".pdf").each(function (k, e) {
            var url = $(e).attr("data-url");
            blobGet(url, function (url) {
                //$(e).append('<embed src="' + url + '" frameborder="0" style="width: 100%;height: 100%;min-height: 1000px;" type="application/pdf"></embed>');
                PDFObject.embed(url, e);
                //window.URL.revokeObjectURL($(e).children().attr("src"));
            });
        });
    }
    //静态方法 初始化
    Evidence.init = function (evidence_data, remarks_config, callback) {
        var evidences = [];
        evidence_data.forEach(function (v) {
            evidences.push(new Evidence(v));
        });
        Evidence.remarks_config = remarks_config.sort(function (a, b) {
            a.children = a.children.sort(function (a, b) {
                var s = a.text.toLowerCase();
                var t = b.text.toLowerCase();
                if (s < t) return -1;
                if (s > t) return 1;
            });
            var s = a.text.toLowerCase();
            var t = b.text.toLowerCase();
            if (s < t) return -1;
            if (s > t) return 1;

        });
        Evidence.evidence_img_init(evidences);
        Evidence.result_show(evidences, callback);

        var myModal = $('#myModal');
        myModal.off();
        myModal.on("hidden.bs.modal", function () {
            Evidence.result_show(evidences, callback);
        });
    }
    Evidence.init(
        evidence_data,
        remark_data, function (obj) {
            $.post(requestUrl, obj, function (data) {
                console.log(obj)
                if (data.code == 0) {
                    window.location.href = data.data;
                } else {
                    layer.msg(data.data);
                }

            });
        })
})

