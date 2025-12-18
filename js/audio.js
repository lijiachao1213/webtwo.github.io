// 播放按钮
var playPause = document.getElementById('playPause');
var audio = document.getElementById('audioTag');

// 获取唱片元素
var rotateImg = document.getElementsByClassName('record-img')[0];

// 获取body元素
var body = document.body;

// 获取上一首按钮
var beforeMusic = document.getElementById('before-music');
// 获取下一首按钮
var nextMusic = document.getElementById('last-music');

// 音乐名称
var musicTitle = document.getElementsByClassName('music-title')[0];
var authorName = document.getElementsByClassName('author-name')[0];

// 进度条
var progressTotal = document.getElementsByClassName('progress')[0];
var progressPlay = document.getElementsByClassName('progress-play')[0];

// 时间
var playedTime = document.getElementsByClassName('played-time')[0];
var totleTime = document.getElementsByClassName('audio-time')[0];

// 播放模式
var playMode = document.getElementById('playMode');

// 音量
var volume = document.getElementById('volumn');
var volumeTogger = document.getElementById('volumn-togger');

// 倍速
var speed = document.getElementById('speed');

// 列表
var list = document.getElementById('list');
var closeList = document.getElementsByClassName('close-list')[0];
var musicContainer = document.getElementsByClassName('music-container')[0];
var musicLists = document.getElementsByClassName('musiclists')[0];

// 存音乐的详情
var musicData = [['落春赋','25216950225李嘉超'],['a','ea'],['b','eb'],['c','ec']];

var musicId = 0;

// 音乐的初始化
function initMusic(){
   audio.src = `./mp3/music${musicId}.mp3`;
   audio.load();
   // 加载音乐元数据时
   audio.onloadedmetadata = function(){
    rotateImg.style.backgroundImage = `url('img/record${musicId}.jpg')`;
    body.style.backgroundImage = `url('img/bg${musicId}.png')`;
    musicTitle.innerText = musicData[musicId][0];
    authorName.innerText = musicData[musicId][1];
    refreshRotate();
    totleTime.innerText = transTime(audio.duration);
    audio.currentTime = 0;
   };
}

initMusic();

function initAndPlay(){
    initMusic();
    audio.play();
    rotateRecord();
    playPause.classList.remove('icon-play');
    playPause.classList.add('icon-pause');
}

// 点击按钮播放音乐
playPause.addEventListener('click',function(){
    if(audio.paused){
        audio.play();
        rotateRecord();
        // playPause.style.backgroundImage = `url('img/暂停.png')`
        playPause.classList.remove('icon-play');
        playPause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        // playPause.style.backgroundImage = `url('img/继续播放.png')`
        playPause.classList.remove('icon-pause');
        playPause.classList.add('icon-play');
    }
})

// 唱片旋转
function rotateRecord(){
    rotateImg.style.animationPlayState = 'running';
}

// 唱片旋转
function rotateRecordStop(){
    rotateImg.style.animationPlayState = 'paused';
}

// 刷新唱片角度
function refreshRotate(){
    rotateImg.classList.add('rotate-play');
}

// 跳转到下一首
nextMusic.addEventListener('click',function(){
    musicId++;
    if(musicId >= musicData.length){
        musicId = 0;
    }
    initAndPlay();
})

// 跳转到上一首
beforeMusic.addEventListener('click',function(){
    musicId--;
    if(musicId < 0){
        musicId = musicData.length - 1;
    }
    initAndPlay();
});

// 更新进度条
function updateProgress(){
    var value = audio.currentTime / audio.duration;
    progressPlay.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);
}
audio.addEventListener('timeupdate',updateProgress);

// 点击进度条跳转到指定位置
progressTotal.addEventListener('mousedown',function(event){
    if(!audio.paused || audio.currentTime != 0) {
        var pgsWidth = progressTotal.getBoundingClientRect().width;
        var rate = event.offsetX / pgsWidth;
        audio.currentTime = audio.duration * rate;
        updateProgress();
    }
});

// 把音乐默认的几千秒转成几分几秒
function transTime(value){
    var time = '';
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h>0){
        time = formateTime(h + ':' + m + ':' + s);
    }else{
        time = formateTime(m + ':' + s);
    }
    return time;
}

// 格式化时间
function formateTime(value){
    var time = '';
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1 ; i++){
        time += s[i].length == 1 ? '0' + s[i] : s[i];
        time += ':';
    }
    time += s[i].length == 1 ? '0' + s[i] : s[i];

    // 优化
    // for (var i=0;i<s.length;i++){
    //     time += s[i].length == 1 ? '0' + s[i] : s[i];
    //     if (i < 2 && s.length == 3){
    //         return time;
    //     }
    //     time += ':';
    // }

    return time;
}

// 音乐模式
var modeId = 1;
playMode.addEventListener('click',function(){
    modeId++;
    if(modeId > 3) {
        modeId = 1;
    }
    playMode.style.backgroundImage = `url('img/mode${modeId}.png')`;
});

// 音乐播放完
audio.addEventListener('ended',function(){
    if(modeId==2) {
        musicId = (musicId + 1) % musicData.length;
    }else if(modeId == 3) {
        var oldId = musicId;
        while(true) {
            // Math.random()会生成0到1之间的一个小数
            musicId = Math.floor(Math.random() * musicData.length);
            if(musicId != oldId) {
                break;
            }
        }
    }
    initAndPlay();
});

// 音量控制
var lastVolume = 70;
audio.volume = lastVolume / 100;
// 滑块控制音量
volumeTogger.addEventListener('input',updateVolume);
function updateVolume() {
    var volumeValue = volumeTogger.value / 100;
    audio.volume = volumeValue;
    if(volumeValue > 0){
        audio.muted = false;
    }
    updateVolumeIcon();
}
// 静音按钮控制音量
volume.addEventListener('click',setNoVolume);
function setNoVolume() {
    if(audio.muted || audio.value == 0){
        audio.muted = false;
        volumeTogger.value = lastVolume;
        audio.volume = lastVolume / 100;
    }else{
        audio.muted = true;
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
    }
    updateVolumeIcon();
}

function updateVolumeIcon(){
    if(audio.muted || audio.volume === 0){
        volume.style.backgroundImage = `url('img/静音.png')`;
    }else{
        volume.style.backgroundImage = `url('img/音量.png')`;
    }
}

// 倍速功能
speed.addEventListener('click',function(){
    var speedText = speed.innerText;
    if(speedText == '1.0X') {
        speed.innerText = '1.5X';
        audio.playbackRate = 1.5;
    }else if(speedText == '1.5X') {
        speed.innerText = '2.0X';
        audio.playbackRate = 2.0;
    }else if(speedText == '2.0X') {
        speed.innerText = '0.5X';
        audio.playbackRate = 0.5;
    }else if(speedText == '0.5X') {
        speed.innerText = '1.0X';
        audio.playbackRate = 1.0;
    }
});

// 列表
list.addEventListener('click',function(){
    musicContainer.classList.remove('list-hide');
    musicContainer.classList.add('list-show');
    closeList.style.display = 'block';
    musicContainer.style.display = 'block';
});

// 隐藏列表
closeList.addEventListener('click',function(){
    musicContainer.classList.remove('list-show');
    musicContainer.classList.add('list-hide');
    closeList.style.display = 'none';
    // musicContainer.style.display = 'none';
});

// 用来生成列表歌单
function createMusicList(){
    for(let i=0;i<musicData.length;i++) {
        // 在musicLists里面创建div元素
        let div = document.createElement('div');
        div.innerText = `${musicData[i][0]}`;
        musicLists.appendChild(div);
        div.addEventListener('click',function(){
            musicId = i;
            initAndPlay();
        });
    }
}
document.addEventListener('DOMContentLoaded',createMusicList);