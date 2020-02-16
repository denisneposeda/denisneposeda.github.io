$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    })

    $('.form-select').selectric();

    function closeElement(element) {
        $(document).mouseup(function (e){
            var div = element;
            if (!div.is(e.target)
                && div.has(e.target).length === 0) {
                div.removeClass('is-open');
            }
        });    
    }

    closeElement($('.dropdown'));

    $('.dropdown-control').click(function(){
        $(this).children('.dropdown').addClass('is-open');
    })

    $('.cooperator-more').click(function(e){
        e.preventDefault();
        var elem = $(this);
        $(this).closest('.card-block').find('.is-hide').slideToggle(function(){
            ( $(this).closest('.card-block').find('.is-hide').is(':visible') ) ? elem.text('Свернуть') : elem.text('Подробнее');
        });
    })

    $('.faq-edit').click(function(e){
        e.preventDefault();
        $(this).closest('.card-block').toggleClass('is-edit');
        ( $(this).closest('.card-block').is('.is-edit') ) ? $(this).text('Сохранить изменения') : $(this).text('Изменить');
    })
    

});
