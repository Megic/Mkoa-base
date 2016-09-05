var $=require('$');
var WebUploader=require('webuploader');
var md5=require('md5');
var $msg=require('$msg');
var init=function($host,userInfo,callback){
    var mainBd=$('#uploader');
    var imageList={};
//megic 添加
//
    mainBd.on("click", ".state-complete", function() {
        var id=$(this).attr('id');
        callback(imageList[id]);//返回选中的图片地址
    });



    var $wrap = mainBd,
// 图片容器
        $queue = $( '<ul class="filelist"></ul>' )
            .appendTo( $wrap.find( '.queueList' ) ),

// 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find( '.statusBar' ),

// 文件总体选择信息。
        $info = $statusBar.find( '.info' ),

// 上传按钮
        $upload = $wrap.find( '.uploadBtn' ),

// 没选择文件之前的内容。
        $placeHolder = $wrap.find( '.placeholder' ),

        $progress = $statusBar.find( '.progress' ).hide(),

// 添加的文件数量
        fileCount = 0,

// 添加的文件总大小
        fileSize = 0,

// 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

// 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,

// 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

// 所有文件的进度信息，key为file id
        percentages = {},

        supportTransition = (function(){
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),

// WebUploader实例
        uploader;
    var chunkSize = 5 * 1024*1024;        //分块大小
    var uniqueFileName ={};          //文件唯一标识符
    var md5Mark = null;

    // var userInfo =userInfo ;   //用户会话信息
    var backEndUrl=$host+'upload/file/add';

    WebUploader.Uploader.register({
        "before-send-file": "beforeSendFile"
        , "before-send": "beforeSend"
        , "after-send-file": "afterSendFile"
    }, {
        beforeSendFile: function(file){
            //秒传验证
            var task = new $.Deferred();
            var start = new Date().getTime();
            (new WebUploader.Uploader()).md5File(file, 0, 10*1024*1024).progress(function(percentage){
               // console.log(percentage);
            }).then(function(val){
                var str=''+userInfo.userId+file.name+file.type+file.lastModifiedDate+file.size;
                var sign=md5(str);
                $.ajax({
                    type: "POST"
                    , url: backEndUrl
                    , data: {
                        status:"md5Check"
                        ,sign:sign
                    }
                    , cache: false
                    , timeout: 1000 //todo 超时的话，只能认为该文件不曾上传过
                    , dataType: "json"
                }).then(function(data, textStatus, jqXHR){
                    if(data.ifExist){   //若存在，这返回失败给WebUploader，表明该文件不需要上传
                       // task.reject();
                        uploader.skipFile(file);
                        task.resolve();
                        file.path = data.path;
                        UploadComlate(file);
                    }else{
                        task.resolve();
                        uniqueFileName[file.id] = sign;
                    }
                }, function(jqXHR, textStatus, errorThrown){    //任何形式的验证失败，都触发重新上传
                    task.resolve();
                    //拿到上传文件的唯一名称，用于断点续传
                    uniqueFileName[file.id] =sign;
                });
            });
            return $.when(task);
        }
        , beforeSend: function(block){
            //分片验证是否已传过，用于断点续传
            var task = new $.Deferred();
            $.ajax({
                type: "POST"
                , url: backEndUrl
                , data: {
                    status: "chunkCheck"
                    , name: uniqueFileName[block.file.id]
                    , chunkIndex: block.chunk
                    , size: block.end - block.start
                }
                , cache: false
                , timeout: 1000 //todo 超时的话，只能认为该分片未上传过
                , dataType: "json"
            }).then(function(data, textStatus, jqXHR){
                if(data.ifExist){   //若存在，返回失败给WebUploader，表明该分块不需要上传
                    task.reject();
                }else{
                    task.resolve();
                }
            }, function(jqXHR, textStatus, errorThrown){    //任何形式的验证失败，都触发重新上传
                task.resolve();
            });

            return $.when(task);
        }
        , afterSendFile: function(file,res){
            var chunksTotal = 0;
            if(!file.skipped&&(chunksTotal = Math.ceil(file.size/chunkSize)) > 1){
                //合并请求
                var task = new $.Deferred();
                $.ajax({
                    type: "POST"
                    , url: backEndUrl
                    , data: {
                        status: "chunksMerge"
                        , name: uniqueFileName[file.id]
                        , chunks: chunksTotal
                        , ext: file.ext
                        , md5: md5Mark
                    }
                    , cache: false
                    , dataType: "json"
                }).then(function(data, textStatus, jqXHR){

                    //todo 检查响应是否正常

                    task.resolve();
                    file.path = data.path;
                    UploadComlate(file);

                }, function(jqXHR, textStatus, errorThrown){
                    task.reject();
                });

                return $.when(task);
            }else{
                if(res&&res.path)file.path=res.path;
                UploadComlate(file);
            }
        }
    });
//完成上传
    function UploadComlate(file){
        imageList[file.id]=file.path;//把链接地址写到字符
        //console.log(file);
    }
// 实例化
    uploader = WebUploader.create({
        pick: {
            id: '#filePicker',
            label: '点击选择文件'
        },
        server: backEndUrl,
        dnd: '#dndArea',
        paste: '#uploader',
        swf:$host+'lib/webuploader/Uploader.swf',
        chunked: true
        , disableGlobalDnd: true
        , thumb: {
            width: 100
            , height: 100
            , quality: 70
            , allowMagnify: true
            , crop: true
            //, type: "image/jpeg"
        }
        , compress: false
        , prepareNextFile: true
        , chunkSize: chunkSize
        , threads: true
        , formData: function(){return $.extend(true, {}, userInfo);}
        , fileNumLimit: 20
        , fileSingleSizeLimit: 1000 * 1024 * 1024
        , duplicate: true
    });

// 添加“添加文件”的按钮，
    uploader.addButton({
        id: '#filePicker2',
        label: '继续添加'
    });

// 当有文件添加进来时执行，负责view的创建
    function addFile( file ) {
        var $li = $( '<li id="' + file.id + '">' +
                '<p class="title">' + file.name + '</p>' +
                '<p class="imgWrap"></p>'+
                '<p class="progress"><span></span></p>' +
                '</li>' ),
            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find( 'p.imgWrap' ),
            $info = $('<p class="error"></p>'),

            showError = function( code ) {
                switch( code ) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text( text ).appendTo( $li );
            };

        if ( file.getStatus() === 'invalid' ) {
            showError( file.statusText );
        } else {
            // @todo lazyload
            $wrap.text( '预览中' );
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $wrap.text( '不能预览' );
                    return;
                }

                var img = $('<img src="'+src+'">');
                $wrap.empty().append( img );
            }, thumbnailWidth, thumbnailHeight );

            percentages[ file.id ] = [ file.size, 0 ];
            file.rotation = 0;
        }

        file.on('statuschange', function( cur, prev ) {
            if ( prev === 'progress' ) {
                $prgress.hide().width(0);
            } else if ( prev === 'queued' ) {
                $li.off( 'mouseenter mouseleave' );
                $btns.remove();
            }

            // 成功
            if ( cur === 'error' || cur === 'invalid' ) {
                //console.log( file.statusText );
                showError( file.statusText );
                percentages[ file.id ][ 1 ] = 1;
            } else if ( cur === 'interrupt' ) {
                showError( 'interrupt' );
            } else if ( cur === 'queued' ) {
                percentages[ file.id ][ 1 ] = 0;
            } else if ( cur === 'progress' ) {
                $info.remove();
                $prgress.css('display', 'block');
            } else if ( cur === 'complete' ) {
                $li.append( '<span class="success"></span>' );
            }

            $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
        });

        $li.on( 'mouseenter', function() {
            $btns.stop().animate({height: 30});
        });

        $li.on( 'mouseleave', function() {
            $btns.stop().animate({height: 0});
        });

        $btns.on( 'click', 'span', function() {
            var index = $(this).index(),
                deg;

            switch ( index ) {
                case 0:
                    uploader.removeFile( file );
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if ( supportTransition ) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
            }


        });

        $li.appendTo( $queue );
    }

// 负责view的销毁
    function removeFile( file ) {
        var $li = $('#'+file.id);

        delete percentages[ file.id ];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each( percentages, function( k, v ) {
            total += v[ 0 ];
            loaded += v[ 0 ] * v[ 1 ];
        } );

        percent = total ? loaded / total : 0;

        spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
        spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;

        if ( state === 'ready' ) {
            text = '选中' + fileCount + '个文件，共' +
                WebUploader.formatSize( fileSize ) + '。';
        } else if ( state === 'confirm' ) {
            stats = uploader.getStats();
            if ( stats.uploadFailNum ) {
                text = '已成功上传' + stats.successNum+ '，'+
                    stats.uploadFailNum + '文件上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '（' +
                WebUploader.formatSize( fileSize )  +
                '），已上传' + stats.successNum + '个';

            if ( stats.uploadFailNum ) {
                text += '，失败' + stats.uploadFailNum + '次';
            }
        }

        $info.html( text );
    }

    function setState( val ) {
        var file, stats;

        if ( val === state ) {
            return;
        }

        $upload.removeClass( 'state-' + state );
        $upload.addClass( 'state-' + val );
        state = val;
        var filePicker2=$( '#filePicker2' );
        switch ( state ) {
            case 'pedding':
                $placeHolder.removeClass( 'element-invisible' );
                $queue.hide();
                $statusBar.addClass( 'element-invisible' );
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass( 'element-invisible' );
                filePicker2.removeClass( 'element-invisible');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                filePicker2.addClass( 'element-invisible' );
                $progress.show();
                $upload.text( '暂停上传' );
                break;

            case 'paused':
                $progress.show();
                $upload.text( '继续上传' );
                break;

            case 'confirm':
                $progress.hide();
                $upload.text( '开始上传' ).addClass( 'disabled' );

                stats = uploader.getStats();
                if ( stats.successNum && !stats.uploadFailNum ) {
                    setState( 'finish' );
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                if ( stats.successNum ) {
                    $msg.success( '上传成功' );
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

    uploader.onUploadProgress = function( file, percentage ) {
        var $li = $('#'+file.id),
            $percent = $li.find('.progress span');

        $percent.css( 'width', percentage * 100 + '%' );
        percentages[ file.id ][ 1 ] = percentage;
        updateTotalProgress();
    };

    uploader.onFileQueued = function( file ) {
        fileCount++;
        fileSize += file.size;

        if ( fileCount === 1 ) {
            $placeHolder.addClass( 'element-invisible' );
            $statusBar.show();
        }

        addFile( file );
        setState( 'ready' );
        updateTotalProgress();
    };

    uploader.onFileDequeued = function( file ) {
        fileCount--;
        fileSize -= file.size;

        if ( !fileCount ) {
            setState( 'pedding' );
        }

        removeFile( file );
        updateTotalProgress();

    };

    uploader.on( 'all', function( type ) {
        var stats;
        switch( type ) {
            case 'uploadFinished':
                setState( 'confirm' );
                break;

            case 'startUpload':
                setState( 'uploading' );
                break;

            case 'stopUpload':
                setState( 'paused' );
                break;

        }
    });

    uploader.onError = function( code ) {
        alert( 'Eroor: ' + code );
    };

    $upload.on('click', function() {
        if ( $(this).hasClass( 'disabled' ) ) {
            return false;
        }

        if ( state === 'ready' ) {
            uploader.upload();
        } else if ( state === 'paused' ) {
            uploader.upload();
        } else if ( state === 'uploading' ) {
            uploader.stop();
        }
    });

    $info.on( 'click', '.retry', function() {
        uploader.retry();
    } );

    $info.on( 'click', '.ignore', function() {
        alert( 'todo' );
    } );

    $upload.addClass( 'state-' + state );
    updateTotalProgress();

};


module.exports=init;
