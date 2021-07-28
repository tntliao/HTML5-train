window.onload = function () {
	var arrowEl = document.querySelector("#head .headMain > .arrow"); //三角标
	var liNodes = document.querySelectorAll("#head .headMain > .nav > .list > li"); //所有li
	var upNodes = document.querySelectorAll("#head .headMain > .nav > .list > li .up"); //所有up
	var firstLiNode = liNodes[0]; //下标1的li
	var firstUpNode = firstLiNode.querySelector(".up"); //下标1的li的up ##img在显示,up的div宽度0,溢出隐藏
	var head = document.getElementById('head'); //头部
	var content = document.getElementById('content'); //内容区主屏
	var cLiNodes = document.querySelectorAll("#content .list > li"); //内容去所有li
	var list = document.querySelector('#content > .list');
	var home2LiNodes = document.querySelectorAll("#content > .list > .home .home2 > li"); //active 的li
	var home1LiNodes = document.querySelectorAll("#content > .list > .home .home1 > li"); // 轮播图
	var home1 = document.querySelector("#content > .list > .home .home1"); //用来鼠标移上去停止轮播
	var aboutUls = document.querySelectorAll("#content > .list > .about .about3 > .item > ul"); //两个图片框
	var dotLis = document.querySelectorAll("#content > .dot > li"); //右边五个点

	var now = 0;
	var dir = '';
	var timer;
	var oldIndex = 0;
	var timer3D;
	var autoIndex = 0;

	//第四屏
	picBoom();
	function picBoom() {
		for (i = 0; i < aboutUls.length; i++) {
			change(aboutUls[i]);
		}

		function change(UL) {
			var src = UL.dataset.src; //获取UL标签中的自定义属性
			var w = UL.offsetWidth / 2;
			var h = UL.offsetHeight / 2;
			for (var i = 0; i < 4; i++) {
				var liNode = document.createElement('li'); //创建li标签
				liNode.style.width = w + 'px';
				liNode.style.height = h + 'px';
				var imgNode = document.createElement('img'); //创建img标签

				/* 
					
					1.left:0   top:0
					2.left:-w  top:0
					3.left:0   top:-h
					4.left:-w  top:-h
				 */
				imgNode.style.left = -(i % 2) * w + 'px';
				imgNode.style.top = -Math.floor(i / 2) * h + 'px'; //floor 向下取整
				imgNode.src = src;

				liNode.appendChild(imgNode);
				UL.appendChild(liNode);
			}
			UL.onmouseenter = function () {
				/* 
					1.left:0   top:0
					2.left:-w  top:0
					3.left:0   top:-h
					4.left:w   top:-h
				 */

				/* 
					1. left:0    top:h
					2. left:-2w   top:0
					3. left:w    top:-h
					4. left:-w   top:-2h

					var arrLeft = [0,-2,1,-1];
					var arrTop = [1,0,-1,-2];
				 */
				var imgNodes = this.querySelectorAll('li>img');
				imgNodes[0].style.top = h + 'px';
				imgNodes[1].style.left = -2 * w + 'px';
				imgNodes[2].style.left = w + 'px';
				imgNodes[3].style.top = -2 * h + 'px';
			}
			UL.onmouseleave = function () {
				var imgNodes = this.querySelectorAll('li>img');
				imgNodes[0].style.top = 0 + 'px';
				imgNodes[1].style.left = -w + 'px';
				imgNodes[2].style.left = 0 + 'px';
				imgNodes[3].style.top = -h + 'px';
			}
		}
	}

	home3D();
	function home3D() {
		for (var i = 0; i < home2LiNodes.length; i++) {
			home2LiNodes[i].index = i;
			//注册回调函数(同步) 执行回调函数(异步)
			home2LiNodes[i].onclick = function () {
				clearInterval(timer3D); //清楚定时器
				for (var i = 0; i < home2LiNodes.length; i++) {
					home2LiNodes[i].classList.remove('active'); //for去除所有类
				}
				this.classList.add('active'); //当前li添加类

				//从左往右 当前所有大于上一次索引 rightShow
				if (this.index > oldIndex) {
					home1LiNodes[this.index].classList.remove('leftShow')
					home1LiNodes[this.index].classList.remove('leftHide')
					home1LiNodes[this.index].classList.remove('rightHide')
					home1LiNodes[this.index].classList.add('rightShow')

					home1LiNodes[oldIndex].classList.remove('leftShow')
					home1LiNodes[oldIndex].classList.remove('rightShow')
					home1LiNodes[oldIndex].classList.remove('rightHide')
					home1LiNodes[oldIndex].classList.add('leftHide')
				}
				//从右往左 当前索引小于上一次索引 leftShow
				if (this.index < oldIndex) {
					home1LiNodes[this.index].classList.remove('rightShow');
					home1LiNodes[this.index].classList.remove('leftHide');
					home1LiNodes[this.index].classList.remove('rightShow');
					home1LiNodes[this.index].classList.add('leftShow');

					home1LiNodes[oldIndex].classList.remove("leftShow");
					home1LiNodes[oldIndex].classList.remove("rightShow");
					home1LiNodes[oldIndex].classList.remove("leftHide");
					home1LiNodes[oldIndex].classList.add("rightHide");
				}
				oldIndex = this.index;
				/* 
					手动轮播 ==> 自动轮播的同步问题！！
					手动点完是需要自动轮播的，自动轮播从哪个面开始播？ ==> 手动点的这个面开始自动轮播
					手动轮播的逻辑必须要告诉自动轮播 刚刚点了哪一个面
				 */
				autoIndex = this.index;

				//重新开启轮播
				//move();
			}
		}
		//从左向右自动轮播
		move();
		function move() {
			clearInterval(timer3D);
			//定时器的调用(同步) 定时器回调函数的执行(异步)
			timer3D = setInterval(function () {
				autoIndex++;

				//无缝
				if (autoIndex == home1LiNodes.length) {
					autoIndex = 0;
				}

				for (var i = 0; i < home2LiNodes.length; i++) {
					home2LiNodes[i].classList.remove('active');
				}
				home2LiNodes[autoIndex].classList.add('active');

				home1LiNodes[autoIndex].classList.remove('leftShow');
				home1LiNodes[autoIndex].classList.remove('leftHide');
				home1LiNodes[autoIndex].classList.remove('rightHide');
				home1LiNodes[autoIndex].classList.add('rightShow');

				home1LiNodes[oldIndex].classList.remove("leftShow");
				home1LiNodes[oldIndex].classList.remove("rightShow");
				home1LiNodes[oldIndex].classList.remove("rightHide");
				home1LiNodes[oldIndex].classList.add("leftHide");

				/* 
					自动轮播 ==> 手动轮播的同步问题！！
					自动轮播一直运行...autoIndex一直在加加，自动轮播一半时有可能触发手动轮播
					这个时候自动轮播的逻辑必须要告诉手动轮播 我播到哪一个面上了
				 */
				oldIndex = autoIndex;
			}, 2000);
		}
		home1.onmouseenter = function () {
			clearInterval(timer3D);
		}
		// home1.onmouseleave = function () {
		// 	move();
		// }
	}



	if (content.addEventListener) {
		content.addEventListener('DOMMouseScroll', function (ev) {
			ev = ev || window.event;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn(ev);
			}, 200);
		})
	}
	content.onmousewheel = function (ev) {
		ev = ev || window.event;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn(ev);
		}, 200);
	};

	function fn(ev) {
		ev = ev || window.event;
		if (ev.wheelDelta) {
			dir = ev.wheelDelta < 0 ? 'down' : 'up';
		} else if (ev.detail) {
			dir = ev.detail < 0 ? 'up' : 'down';
		}

		switch (dir) {
			case 'up':
				if (now > 0) {
					now--;
					list.style.top = -cLiNodes[0].offsetHeight * now + 'px';
					move(now)
				}
				break;
			case 'down':
				if (now < liNodes.length - 1) {
					now++;
					list.style.top = -cLiNodes[0].offsetHeight * now + 'px';
					move(now);
				}
				break;
		}
	}

	window.onresize = function () {
		/*
			调整分辨率
				1.没有点击的时候视口只能出现一屏  contentBind();
				2.点击后视口只能出现一屏  在1的基础上对每一屏的偏移量进行重新调整
				3.小箭头的位置也需要头部
		*/

		// contentBind();
		// content.style.top = -now * (document.documentElement.clientHeight - head.offsetHeight) + "px";
		arrowEl.style.left = liNodes[now].offsetLeft + liNodes[now].offsetWidth / 2 - arrowEl.offsetWidth / 2 +
			"px"; //三角标窗口改变重新调整
	}
	//内容区
	contentBind();

	function contentBind() {
		content.style.height = document.documentElement.clientHeight - head.offsetHeight + 'px';
		for (var i = 0; i < cLiNodes.length; i++) {
			cLiNodes[i].style.height = document.documentElement.clientHeight - head.offsetHeight + 'px';
		}
	}

	//头部交互
	headBing();

	function headBing() {
		/* 
			754 18 21
			如果你移动鼠标dom结构查看会看到黄色的margin,offsetLeft会把padding算上,不会把margin算上,所以offsetLeft就是视觉上从home照片左边开始算
		  */
		arrowEl.style.left = firstLiNode.offsetLeft + firstLiNode.offsetWidth / 2 - arrowEl.offsetWidth / 2 + 'px';
		firstUpNode.style.width = '100%'; //设置img的父标签up宽度,图片就慢慢出来了
		for (var i = 0; i < liNodes.length; i++) {
			//转绑
			liNodes[i].index = i;
			liNodes[i].onclick = function () {
				//i:liNodes.length 5
				move(this.index);
				now = this.index;
			}
		}
	}
	for (var i = 0; i < dotLis.length; i++) {
		//转绑
		dotLis[i].index = i;
		dotLis[i].onclick = function () {
			move(this.index);
			now = this.index;
		}
	}

	//主要动画
	move(3)
	function move(index) {
		for (var j = 0; j < liNodes.length; j++) {
			//不要这样子写会添加到内行样式, 会出现hover之后一些问题, 或者去style hover哪里添加!important,
			// upNodes.style.width = '0';
			upNodes[j].style.width = ''; //或者这样为空
		}
		upNodes[index].style.width = '100%';
		arrowEl.style.left = liNodes[index].offsetLeft + liNodes[index].offsetWidth / 2 - arrowEl.offsetWidth /
			2 + 'px';
		list.style.top = -cLiNodes[0].offsetHeight * index + 'px';

		for (var i = 0; i < dotLis.length; i++) {
			dotLis[i].className = '';
		}
		dotLis[index].className = 'active';
	}
}
