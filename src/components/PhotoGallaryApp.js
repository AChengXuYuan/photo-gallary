'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;//处理reat动画的底层api
var imageDatas = require('../data/imageData.json');

// CSS
require('normalize.css');
require('../styles/main.css');

var imageDatas = (function(imageDatasArr){
    for(var i = 0, length = imageDatasArr.length; i < length; i++){
        var singleImageData = imageDatasArr[i];
        singleImageData.inageURL = require('../images/' + singleImageData.fileName);
        imageDatas[i] = singleImageData;
    }
    return imageDatas;
})(imageDatas);
var ImgComponet = React.createClass({
    getInitialState: function(){
        return {};
    },
    //组件加载完成后，
    componentDidMount: function(){
    },
    imgFigureClick: function(e){
        if (this.props.geometry.iscenter){
            this.props.inverse();
        } else{
            this.props.arrangeImg();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    render: function(){
        var style = {},
            isInverse = ( this.props.geometry.inverse ? 'is-inverse' : 'no-inverse' );
        //设置文件位置
        if(this.props.geometry) {
            style.left = this.props.geometry.x + 'px';
            style.top = this.props.geometry.y + 'px';
            if(!this.props.geometry.iscenter) {
                (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                    style[value] = 'rotate(' + this.props.geometry.rotate + 'deg)';
                }.bind(this));
                style.zIndex = 0;
            }else{
                style.zIndex = 1;
            }
        }

        return (
            <figure className={isInverse} style={style} onClick={this.imgFigureClick}>
                <img src={this.props.data.inageURL}/>
                <figcaption>
                    <span>{this.props.data.title}</span>
                    <div className='img-back' onClick={this.imgFigureClick}>
                        <p>{this.props.data.desc}</p>
                    </div>

                </figcaption>
            </figure>
        );
    }
});
var ControlComponet = React.createClass({
    getInitialState: function(){
        return {};
    },
    //组件加载完成后，
    componentDidMount: function(){
    },
    render: function(){
        var controlSpan = 'controlSpan';
        controlSpan += this.props.geometry.iscenter ? ' is-center' : '';
        controlSpan += this.props.geometry.inverse ? ' is-inverse' : '';
        return (<span className={controlSpan} onClick={this.handClick}></span>);
    },
    handClick: function(e){
        if (this.props.geometry.iscenter){
            this.props.inverse();
        } else{
            this.props.arrangeImg();
        }
        e.stopPropagation();
        e.preventDefault();
    }
});
var GalleryByReactApp = React.createClass({
    getInitialState: function(){
        return {
            imgsInfos: [
                /*   {
                "position": {
                    "x":"",
                    "y":""
                },
                iscenter: false,
                "rotate":"",
                "data":{fileName:"", fileURL:"", fifleDesc:""}
            }*/
            ]
        }; //设置初始state
    },
    //组件加载完成后，
    componentDidMount: function(){
        //计算舞台大小，分配图片控件位置，
        var stageDOM = React.findDOMNode(this.refs.stage),
            contenWidth = stageDOM.scrollWidth,
            contenHeight = stageDOM.scrollHeight,
            imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
            figureWidth = imgFigureDOM.scrollWidth,
            figureHeight = imgFigureDOM.scrollHeight,
            halfContenWidth = Math.ceil(contenWidth / 2),
            halfContenHeight = Math.ceil(contenHeight / 2),
            halfFigureWidth = Math.ceil(figureWidth / 2),
            halfFigureHeight = Math.ceil(figureHeight / 2),
            sectionTop = {
                'width': [halfContenWidth - halfFigureWidth, halfContenWidth - halfFigureWidth],
                'height': [0, halfContenHeight - halfFigureHeight * 3]
            },
            sectionLeft = {
                'width': [0, halfContenWidth - halfFigureWidth * 3],
                'height': [0, contenHeight - figureWidth ]
            },
            sectionRight = {
                'width': [halfContenWidth + halfFigureWidth, contenWidth - figureWidth],
                'height': [0, contenHeight - figureWidth ]
            };
        this.section = {
            'sectionTop': sectionTop,
            'sectionLeft': sectionLeft,
            'sectionRight': sectionRight,
            'center': {
                'width': halfContenWidth - halfFigureWidth,
                'height': halfContenHeight - halfFigureHeight
            }
        };
        this.arrangeImg(0)();
    },
    render: function(){
        var imgComponetArray = [],
            controlComponetArray = [],
            showImageDatas = this.state.imgsInfos.length > 0 ? this.state.imgsInfos : imageDatas;
        showImageDatas.forEach(function(item, index){
            if(!this.state.imgsInfos[index]){
                this.state.imgsInfos[index] = {
                    'geometry': {
                        'x': 0,
                        'y': 0,
                        'iscenter': false,
                        'rotate': 0,
                        'inverse': false
                    },
                    'data': item
                };
            }
            imgComponetArray.push(<ImgComponet ref={'imgFigure' + index} data={this.state.imgsInfos[index].data} geometry={this.state.imgsInfos[index].geometry} arrangeImg={this.arrangeImg(index)} inverse={this.inverse(index)}/>);
            controlComponetArray.push(<ControlComponet index={index} geometry={this.state.imgsInfos[index].geometry} arrangeImg={this.arrangeImg(index)} inverse={this.inverse(index)}/>);
        }.bind(this));
        return (
            <section className='stage' ref='stage'>
                <section className='img-sec'>
                    {imgComponetArray}
                </section>
                <nav className='controller-nav'>
                    {controlComponetArray}
                </nav>
            </section>
        );
    },
    /**
     * 排列图片位置
     * @param index
     * @returns {Function}
     */
    arrangeImg: function(index){
        return function() {
            var imgInfos = this.state.imgsInfos,
                centerImgInfo = imgInfos.splice(index, 1),

                topImgNum = Math.floor(Math.random() * 2),
                leftNum = Math.floor((imgInfos.length - topImgNum) / 2),//取1个或者不取
                topImgINosIndex = Math.floor(imgInfos.length - topImgNum);
            centerImgInfo[0].geometry = {
                'x': this.section.center.width,
                'y': this.section.center.height,
                'iscenter': true,
                'rotate': 0,
                'inverse': false
            };
            var topImgInfos = imgInfos.splice(topImgINosIndex, topImgNum).map(function (item) {
                item.geometry = {
                    'x': this.section.sectionTop.width[0] + Math.ceil(Math.random() * (this.section.sectionTop.width[1] - this.section.sectionTop.width[0])),
                    'y': this.section.sectionTop.height[0] + Math.ceil(Math.random() * (this.section.sectionTop.height[1] - this.section.sectionTop.height[0])),
                    'iscenter': false,
                    'rotate': ((Math.random() * 10 > 5) ? '-' : '') + Math.ceil(Math.random() * 30),
                    'inverse': false
                };
                return item;
            }.bind(this));
            var leftAndRightImgInfos = imgInfos.map( function(item, i) {
                if (i < leftNum) {
                    item.geometry = {
                        'x': this.section.sectionLeft.width[0] + Math.ceil(Math.random() * (this.section.sectionLeft.width[1] - this.section.sectionLeft.width[0])),
                        'y': this.section.sectionLeft.height[0] + Math.ceil(Math.random() * (this.section.sectionLeft.height[1] - this.section.sectionLeft.height[0])),
                        'iscenter': false,
                        'rotate': ((Math.random() * 10 > 5) ? '-' : '') + Math.ceil(Math.random() * 30),
                        'inverse': false
                    };
                } else {
                    item.geometry = {
                        'x': this.section.sectionRight.width[0] + Math.ceil(Math.random() * (this.section.sectionRight.width[1] - this.section.sectionRight.width[0])),
                        'y': this.section.sectionRight.height[0] + Math.ceil(Math.random() * (this.section.sectionRight.height[1] - this.section.sectionRight.height[0])),
                        'iscenter': false,
                        'rotate': ((Math.random() * 10 > 5) ? '-' : '') + Math.ceil(Math.random() * 30),
                        'inverse': false
                    };
                }
                return item;
            }.bind(this));
            if(topImgInfos && topImgInfos[0]){
                leftAndRightImgInfos.splice(topImgINosIndex, 0, topImgInfos[0] );
            }
            leftAndRightImgInfos.splice(index, 0, centerImgInfo[0]);
            this.setState({
                imgsInfos: leftAndRightImgInfos
            });
        }.bind(this);
    },
    /**
     * 旋转图片
     * @param index
     * @returns {Function}
     */
    inverse: function(index){
        return function() {
            var imgsInfos = this.state.imgsInfos;
            imgsInfos[index].geometry.inverse = !imgsInfos[index].geometry.inverse;
            this.setState({
                imgsInfos: imgsInfos
            });
        }.bind(this);
    }
});
module.exports = GalleryByReactApp;
