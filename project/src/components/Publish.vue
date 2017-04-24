<template>
    <div class="container">
        <form class="publish_content" action="" method="post" enctype="multipart/form-data">
            <div class="weui-cells__title">话题分类 <sup>*</sup></div>
            <div class="weui-cells">
                <div class="weui-cell weui-cell_select">
                    <div class="weui-cell__bd">
                        <select class="weui-select" name="select1" id="topic_select">
                            <option selected="selected" value="0">请选择话题分类</option>
                            <option v-for="item in topics" selected="" :value="item.id">{{item.content}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="weui-cells__title">评论 <sup>*</sup></div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <textarea class="weui-textarea" id="comment" placeholder="请输入文本" rows="3"></textarea>
                    </div>
                </div>
            </div>
            <div class="weui-cells__title">上传1至3张截图 <sup class="pic_sup">*</sup></div>
            <div class="weui-cells">
                <div class="pic_insert" id="pic_insert1">
                    <img :src="image[0]" alt="" class="pic_preview" id="pic_file1">
                    <input class="pic_input" id="pic_files1" type="file" name="pic_file1" @change="change(0,$event)"
                           accept="image">
                </div>
                <div class="pic_insert" id="pic_insert2">
                    <img src="../assets/images/pic_insert.png" alt="" class="pic_preview" id="pic_file2">
                    <input class="pic_input" id="pic_files2" type="file" name="pic_file2">
                </div>
                <div class="pic_insert" id="pic_insert3">
                    <img src="../assets/images/pic_insert.png" alt="" class="pic_preview" id="pic_file3">
                    <input class="pic_input" id="pic_files3" type="file" name="pic_file3">
                </div>
            </div>
            <!--<div id="pic_blank">-->
            <!--添加3张截图-->
            <!--</div>-->
            <div class="weui-cells__title">公开/仅自己可见</div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell weui-cell_switch">
                    <div class="weui-cell__bd" id="open_close">公开</div>
                    <div class="weui-cell__ft">
                        <input id="checkbox" class="weui-switch" type="checkbox" checked>
                    </div>
                </div>
            </div>
        </form>
        <div>
            <a href="javascript:;" class="weui-btn weui-btn_primary" id="showIOSDialog1">提交</a>
        </div>
        <mt-popup v-model="popupVisible" position="right" >
            <canvas id="canvas"></canvas>
        </mt-popup>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import insert from '../assets/images/pic_insert.png';
    import Exif from 'exif-js'

    export default{
        data(){
            return {
                image: [insert,insert,insert],
                popupVisible:false
            }
        },
        computed: mapState(['topics']),
        methods: {
            change: function (index, event) {
                let file = event.target.files[0];
                let Orientation;
                Exif.getData(file, function () {
                    Orientation = Exif.getTag(this, 'Orientation');
                });
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async function () {
                    var result = this.result;
                    let img = new Image();
                    img.src = result;
                    if(this.result.length>(100*1024)||Orientation!=1){
                        result=self.compress(img,Orientation);
                    }
                    $('#canvas').css('background-image', 'url(' + img + ')');
                    this.changePopupStatus();
                }
            },
            rotateImg (img, direction,canvas) {
                //最小与最大旋转方向，图片旋转4次后回到原方向
                const min_step = 0;
                const max_step = 3;
                if (img == null)return;
                //img的高度和宽度不能在img元素隐藏后获取，否则会出错
                let height = img.height;
                let width = img.width;
                let step = 2;
                if (step == null) {
                    step = min_step;
                }
                if (direction == 'right') {
                    step++;
                    //旋转到原位置，即超过最大值
                    step > max_step && (step = min_step);
                } else {
                    step--;
                    step < min_step && (step = max_step);
                }
                //旋转角度以弧度值为参数
                let degree = step * 90 * Math.PI / 180;
                let ctx = canvas.getContext('2d');
                switch (step) {
                    case 0:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0);
                        break;
                    case 1:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, 0, -height);
                        break;
                    case 2:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, -height);
                        break;
                    case 3:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, 0);
                        break;
                }
            },
            compress(img,Orientation) {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext('2d');
                //瓦片canvas
                let tCanvas = document.createElement("canvas");
                let tctx = tCanvas.getContext("2d");
                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;
                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                let ratio;
                if ((ratio = width * height / 4000000) > 1) {
                    console.log("大于400万像素")
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                canvas.width = width;
                canvas.height = height;
                //        铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                //如果图片像素大于100万则使用瓦片绘制
                let count;
                if ((count = width * height / 1000000) > 1) {
                    console.log("超过100W像素");
                    count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                    //            计算每块瓦片的宽和高
                    let nw = ~~(width / count);
                    let nh = ~~(height / count);
                    tCanvas.width = nw;
                    tCanvas.height = nh;
                    for (let i = 0; i < count; i++) {
                        for (let j = 0; j < count; j++) {
                            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                        }
                    }
                } else {
                    ctx.drawImage(img, 0, 0, width, height);
                }
                //修复ios上传图片的时候 被旋转的问题
                if(Orientation != "" && Orientation != 1){
                    switch(Orientation){
                        case 6://需要顺时针（向左）90度旋转
                            this.rotateImg(img,'left',canvas);
                            break;
                        case 8://需要逆时针（向右）90度旋转
                            this.rotateImg(img,'right',canvas);
                            break;
                        case 3://需要180度旋转
                            this.rotateImg(img,'right',canvas);//转两次
                            this.rotateImg(img,'right',canvas);
                            break;
                    }
                }
                //进行最小压缩
                let ndata = canvas.toDataURL('image/jpeg', 0.1);
                console.log('压缩前：' + initSize);
                console.log('压缩后：' + ndata.length);
                console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                return ndata;
            },
            changePopupStatus:function () {
                this.popupVisible=!this.popupVisible;
            }
        }
    }
</script>

<style scoped>

    *:focus {
        outline: none;
    }

    body {
        background-color: #f5f5f5;
    }

    .container {
        background-color: #f8f8f8;
        padding-right: 0 !important;
        padding-left: 0 !important;
    }

    .publish_content {
        background-color: #f5f5f5;
    }

    .weui-cells {
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
    }

    .weui-cells:after, .weui-cells:before {
        border: none;
    }

    .weui-cells__title sup {
        color: red;
    }

    .text_insert {
        padding: 10px 15px;
        height: 100px;
    }

    #comment {
        width: 100%;
        height: 100%;
        border: none;
        resize: none;
    }

    .pic_insert {
        display: inline-block;
        padding: 10px 0 10px 15px;
        position: relative;
    }

    .pic_preview {
        width: 50px;
        height: 50px;
    }

    .pic_input {
        width: 50px;
        height: 50px;
        position: absolute;
        opacity: 0;
        top: 0;
        left: 15px;
    }

    #pic_blank {
        display: inline-block;
        color: #888888;
    }

    .topic_choose select {
        display: inline-block;
        font-size: 14px;
        margin: 0 15px 10px 15px;
        width: 200px;
        height: 32px;
        border-radius: 6px;
    }

    .topic_choose select option {
        width: 200px;
        background-color: #fff;
        color: #000;
    }

    .switch {
        display: inline-block;
    }

    .weui-btn_primary {
        margin: 15px;
    }

    .url_insert {
        padding: 0 15px;
        position: relative;
    }

    .url_icon {
        width: 32px;
        height: 26px;
        text-align: center;
        position: absolute;
        top: 4px;
        left: 15px;
    }

    .url_icon img {
        width: 22px;
        height: 22px;
    }

    #url {
        height: 24px;
        padding-top: 6px;
        font-size: 14px;
        width: 90%;
        resize: none;
        padding-left: 10%;
        border-radius: 4px;
        border: 1px solid #8a8a8a;
    }

    lable {
        font-size: 16px;
        color: inherit;
    }

    #topic {
        width: auto;
        max-width: 80%;
        height: 20px;
        border: none;
        font-size: 16px;
        color: inherit;
    }

    #write_icon {
        vertical-align: bottom;
    }

    .modal-body {
        text-align: center;
    }

    .weui-tabbar__label {
        margin-bottom: 0;
    }

    .instructions {
        width: 100%;
        position: absolute;
        bottom: 55px;
        color: #888888;
        font-size: 12px;
        text-align: center;
    }

    .instructions ol {
        margin: 0;
        list-style-position: inside;
    }

</style>