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
	var now = 0;
	var dir = '';
	var timer;
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

	move(1)
	//主要动画
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
	}
}
