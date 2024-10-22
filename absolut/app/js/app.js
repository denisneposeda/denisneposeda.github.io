document.addEventListener('DOMContentLoaded', () => {	
	updateVh();

	window.addEventListener('resize', updateVh);

	function updateVh() {
		document.querySelector(':root').style
			.setProperty('--vh', window.innerHeight / 100 + 'px');
	}
})