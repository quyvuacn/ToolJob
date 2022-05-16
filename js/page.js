$(document).ready(function(){
    $(".li-slide").width($('.checkboxes .active').width())
    $(".li-slide").position().left=$('.checkboxes .active').position().left

    $('.checkboxes .select').mouseenter(function(){
        $(".li-slide").stop()
        let left = $(this).position().left
        width = $(this).width() 
        $(".li-slide").animate({
            left: left,
            width: width
        },300)
    })

    $('.checkboxes .select').mouseleave(function(){
        $(".li-slide").stop()
        let left = $(".checkboxes .active").position().left
        let width = $(".checkboxes .active").width()
        $(".li-slide").animate({
            left: left,
            width: width
        },300)

    })
     
    $('.checkboxes .select').click(function(){
        $('.checkboxes .select').removeClass('active')
        $(this).addClass('active')
    })

    $("#select-view").click(function(){
        $(".tool").hide()
        if($("#view").css("display") == "none"){
            $("#view").fadeIn(400)
        }
        
    })
    $("#select-code").click(function(){
        $(".tool").hide()
        $("#code").show()
    })
    $("#select-pending").click(function(){
        $(".tool").hide()
        $("#pending").show()
    })

   $("#select-manage").click(function(){
    $(".tool").hide()
    $("#manage").show()
    })

    $("#select-guide").click(function(){
        $(".tool").hide()
        $("#guide").show()
        })




})