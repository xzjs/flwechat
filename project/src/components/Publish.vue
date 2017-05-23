<template>
    <div>
        <form class="publish_content" action="" method="post" enctype="multipart/form-data">
            <div class="weui-cells__title">话题分类 <sup>*</sup></div>
            <div class="weui-cells">
                <div class="weui-cell weui-cell_select">
                    <div class="weui-cell__bd">
                        <select class="weui-select" name="select1" id="topic_select" v-model="topicId">
                            <option selected="selected" value="0">请选择话题分类</option>
                            <option v-for="item in topics" :value="item.id">{{item.content}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="weui-cells__title">评论 <sup>*</sup></div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <textarea class="weui-textarea" id="comment" placeholder="请输入文本" rows="3"
                                  v-model="comment"></textarea>
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
                    <img :src="image[1]" alt="" class="pic_preview" id="pic_file2">
                    <input class="pic_input" id="pic_files2" type="file" name="pic_file2" @change="change(1,$event)"
                           accept="image">
                </div>
                <div class="pic_insert" id="pic_insert3">
                    <img :src="image[2]" alt="" class="pic_preview" id="pic_file3">
                    <input class="pic_input" id="pic_files3" type="file" name="pic_file3" @change="change(2,$event)"
                           accept="image">
                </div>
            </div>
            <!--<div id="pic_blank">-->
            <!--添加3张截图-->
            <!--</div>-->
            <div class="weui-cells__title">公开/仅自己可见</div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell weui-cell_switch">
                    <div class="weui-cell__bd" id="open_close">{{publicText}}</div>
                    <div class="weui-cell__ft">
                        <mt-switch v-model="isPublic"></mt-switch>
                    </div>
                </div>
            </div>
        </form>
        <el-row type="flex" justify="space-around" class="row">
            <el-col :span="22">
                <mt-button type="primary" class="button" @click="submit">提交</mt-button>
            </el-col>
        </el-row>
        <mt-popup v-model="popupVisible" position="right" popup-transition="popup-fade">
            <el-row>
                <el-col>
                    <canvas id="canvas" :width="width" :height="height"></canvas>
                </el-col>
            </el-row>
            <el-row type="flex" justify="end" class="row float-button">
                <el-col :span="4">
                    <el-button @click="cancel">取消</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button @click="clear">清除</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="info" @click="save">确认</el-button>
                </el-col>
            </el-row>
        </mt-popup>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import insert from '../assets/images/pic_insert.png';
    import Exif from 'exif-js';
    import SignaturePad from 'signature_pad';
    import {MessageBox, Indicator} from 'mint-ui';

    export default{
        data(){
            return {
                image: [insert, insert, insert],
                popupVisible: false,
                width: screen.availWidth,
                height: screen.availHeight,
                signaturePad: null,
                index: -1,
                positions: [],
                imageWidth: 0,
                imageHeight: 0,
                isPublic: true,
                topicId: 0,
                articleId: this.$route.params.id,
                comment: '',
                scale: screen.availHeight / screen.availWidth
            }
        },
        computed: {
            publicText: function () {
                if (this.isPublic) {
                    return '公开';
                } else {
                    return '仅自己可见';
                }
            },
            ...mapState(['topics', 'article'])
        },
        methods: {
            ...mapActions(['getTopics']),
            change: function (index, event) {
                this.index = index;
                var vm = this;
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
                    img.onload = function () {
                        console.log(img.width, img.height);
                        //计算canvas的大小
                        if (Orientation == 1) {
                            var imageScale = img.height / img.width;
                        } else {
                            var imageScale = img.width / img.height;
                        }
                        if (imageScale > vm.scale) {
                            vm.width = vm.height / imageScale;
                        } else {
                            vm.height = vm.width * imageScale;
                        }
                        if (result.length > (100 * 1024) || Orientation != 1) {
                            result = vm.compress(img, Orientation);
                        }
                        $('#canvas').css('background-image', 'url(' + result + ')');
                        $('#canvas').css('background-size', "cover");
                        vm.popupVisible = true;
                        vm.image[index] = result;
                    };
                    vm.signaturePad = new SignaturePad($('#canvas')[0], {
                        penColor: "rgb(229,43,28)",
                        onBegin: function () {
                            console.log('begin');
                        },
                        onEnd: function () {
                            console.log('end');
                        }
                    });
                }
            },
            rotateImg (img, direction, canvas) {
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
            compress(img, Orientation) {
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
                if (Orientation != "" && Orientation != 1) {
                    switch (Orientation) {
                        case 6://需要顺时针（向左）90度旋转
                            this.rotateImg(img, 'left', canvas);
                            break;
                        case 8://需要逆时针（向右）90度旋转
                            this.rotateImg(img, 'right', canvas);
                            break;
                        case 3://需要180度旋转
                            this.rotateImg(img, 'right', canvas);//转两次
                            this.rotateImg(img, 'right', canvas);
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
            cancel: function () {
                this.popupVisible = false;
                this.image[this.index] = insert;
            },
            clear: function () {
                this.signaturePad.clear();
            },
            save: function () {
                let points = this.signaturePad.toData();
                var position = {
                    'max_x': points[0][0].x,
                    'min_x': points[0][0].x,
                    'max_y': points[0][0].y,
                    'min_y': points[0][0].y
                };
                for (var i = 0; i < points.length; i++) {
                    for (var j = 1; j < points[i].length; j++) {
                        position.max_x = Math.max(position.max_x, points[i][j].x);
                        position.min_x = Math.max(Math.min(position.min_x, points[i][j].x), 0);
                        position.max_y = Math.max(position.max_y, points[i][j].y);
                        position.min_y = Math.max(Math.min(position.min_y, points[i][j].y), 0);
                    }
                }
                this.popupVisible = false;
                this.clear();
                var canvas = $('#canvas')[0];
                var context = canvas.getContext('2d');
                context.strokeStyle = "red";
                context.strokeRect(position.min_x, position.min_y, (position.max_x - position.min_x), (position.max_y - position.min_y));
                position.mark = canvas.toDataURL();
                var scale = this.imageWidth / this.width;
                position.max_x *= scale;
                position.min_x *= scale;
                position.max_y *= scale;
                position.min_y *= scale;
                this.positions[this.index] = position;
            },
            setTopics() {
                if (this.articleId == null) {
                    if (this.topics == null) {
                        this.getTopics();
                    }
                } else {
                    this.topicId = this.article.topic_id;
                }
            },
            submit: function () {
                if (this.topicId == 0) {
                    MessageBox('提示', '请选择一个话题分类');
                    return;
                }
                if (this.comment == '') {
                    MessageBox('提示', '说点什么吧');
                    return;
                }
                if (this.articleId == 0 && this.positions.length == 0) {
                    MessageBox('提示', '请至少上传一张图片');
                    return;
                }
                Indicator.open({
                    text: '上传中...',
                    spinnerType: 'fading-circle'
                });
                var formData = {
                    topic_id: this.topicId,
                    comment: this.comment,
                    article_id: this.articleId,
                    is_public: this.isPublic
                };
                for (var i = 0; i < this.image.length; i++) {
                    if (this.image[i] != insert) {
                        formData['image' + i] = {
                            img: this.image[i],
                            position: this.positions[i]
                        };
                    }
                }
                axios.post('/api/articles', formData)
                        .then(response => {
                            if (response.data == true) {
                                Indicator.close();
                                if (!this.isPublic) {
                                    this.$router.push({name: 'Mine'});
                                } else {
                                    if (this.articleId == 0) {
                                        this.$router.push({name: 'Index', params: {topic_id: 0}});
                                    } else {
                                        this.$router.push({name: 'Detail', params: {id: this.articleId}});
                                    }
                                }
                            } else {
                                console.log(response.data);
                            }
                        })
                        .catch(error=> {
                            console.log(error);
                        })
            }
        },
        mounted() {
            this.setTopics();
        }
    }
</script>

<style lang="scss" scoped>

    *:focus {
        outline: none;
    }

    body {
        background-color: #f5f5f5;
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

    .weui-cells__title {
        margin-top: 0;
        padding-top: 0.77em;
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

    .row {
        margin: 10px auto;
    }

    .float-button {
        width: 100%;
        position: absolute;
        bottom: 0;
        right: 15px;
    }

    .button {
        width: 100%;
    }
</style>
