$(document).ready(function () {
    $("#myTopbars, nav a[href], #myOverlay").click(function () {
        // close ALL accordion submenus
        $(".w3-accordion-content").each(function () {
            if ($(this).hasClass("w3-show")) {
                $(this).removeClass("w3-show");
                $(this).prev().children().removeClass("fa-minus");
            }
        });
        $("#myBars").toggleClass("fa-times");
        $("#mySidebar, #myOverlay").toggle();
    });

    $(".w3-accordion").children("a").on("click", function () { // $(".w3-accordion").find(":first") also works
        $(this).next().toggleClass("w3-show");
        $(this).children().toggleClass("fa-minus");
    });

    $("#myVideoSelect").change(function () {
        let selection = $("#myVideoSelect option:selected").text(); // get selected video title
        $("#myVideo").css("opacity", 0).animate({
            opacity: 1
        }, 10000);
        $("#myVideoDL").attr("href", $(this).val()); // add download video if browser is not supported
        $("#myVideoTitle").text(selection); // add selected video title
        $("#myVideo").attr({
            "controls": true,
            "autoplay": true
        }); // add controls AND autoplay to video
        $("#myVideo source").attr("src", $(this).val()); // add selected video to source element
        document.getElementById("myVideoSelect").firstElementChild.selected = true; // reset element to "-- select video --" // TODO: find jQuery selected property !!!!!!!! ==> $("#myVideoSelect option:first").selected;
        document.getElementById("myVideo").load(); // reload selected video // TODO: find jQuery load() method !!!!!!!! ==> $("#myVideo").load();
        document.getElementById("myVideo").play(); // play selected video // TODO: find jQuery play() method !!!!!!!! ==> $("myVideo").play();
        document.getElementById("myVideo").onended = function () { // after video ends, reset values load() default video // TODO: find jQuery onended property !!!!!!!! ==> $("myVideo").onended();
            $("#myVideoDL").attr("href", "#");
            $("#myVideoTitle").html("-- select video --");
            $("#myVideo").attr({
                "controls": false,
                "autoplay": false
            });
            $("#myVideo source").attr("src", "video/fffa_our_team02.mp4");
            document.getElementById("myVideo").load(); // TODO: find jQuery load() method !!!!!!!! ==> $("#myVideo").load();
        };
    });

    $(".faqsClass div").on("click", function () {
        $(this).toggleClass("marker");
        $(this).next("p").fadeToggle("fast");
    });

    $(".faqsClass div").hover(function () { // hover method has 2 functions : mouseenter & mouseleave
        $(this).css("background-color", "#fef1f2");
    }, function () {
        $(this).css("background-color", "rgba(254, 241, 242, 0.3)");
    });

    $("#contfirstname, #contlastname").keyup(function () {
        let regex = /[^a-z-.'" ]/gi; // valid characters: a-z, A-Z, hyphen, period, apostrophe, double-quote, space; NOTE: find a solution to ALLOW commas !!!
        let input = $(this).val();
        let newValue = input.replace(regex, "");
        $(this).val(newValue);
    });

    $("#contfirstname, #contlastname, #contemail, #contmessage").change(function () {
        $(this).parent().prev().find("span span").text("*");
        $(this).css({
            border: "1px solid rgb(204, 204, 204)",
            backgroundColor: "rgb(255, 255, 255)"
        });
        $("#contactusformerr").html("&nbsp;");
    });

    // validate contact form
    function validateForm(event) {
        event.preventDefault();
        if (!$("#contfirstname").val().trim()) {
            contformError("#firstnameerr", "* required", "#contfirstname");
            return;
        }
        if (!$("#contlastname").val().trim()) {
            contformError("#lastnameerr", "* required", "#contlastname");
            return;
        }
        if (!$("#contemail").val().trim()) {
            contformError("#emailerr", "* required", "#contemail");
            return;
        }
        let atpos = $("#contemail").val().indexOf("@");
        let dotpos = $("#contemail").val().lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= $("#contemail").val().trim().length) {
            contformError("#emailerr", "* invalid email address", "#contemail");
            return;
        }
        if (!$("#contmessage").val().trim()) {
            contformError("#messageerr", "* required", "#contmessage");
            return;
        }
        grecaptcha.execute(); // if no errors found, execute reCaptcha
    }

    function contformError(error, errtext, errinput) {
        $(error).text(errtext);
        $(errinput).css({
            border: "2px solid red",
            backgroundColor: "rgb(254, 241, 242)"
        }).focus();
        $("#contactusformerr").html("<span class='fas fa-exclamation-triangle'></span> Correct Error");
        document.querySelector("#contactusform").scrollIntoView(false);
    }

    function carousel() {
        $(".mySlides").each(function (i, elemt) {
            $(elemt).css("display", "none");
        });
        myIndex++;
        if (myIndex > $(".mySlides").length) {
            myIndex = 1;
        }
        $($(".mySlides")[myIndex - 1]).css("display", "block");
        setTimeout(carousel, 5000);
    }
    var myIndex = 0;
    carousel();

    // www.dynamicdrive.com/dynamicindex9/emailscrambler.htm
    $("a[href]").each(function () {
        if ($(this).attr("href").indexOf("_at_") !== -1) {
            $(this).attr("href", $(this).attr("href").split("_at_")[0] + "@" + $(this).attr("href").split("_at_")[1]);
        }
    });

    function Email(part1, atsign, part2) { // constructor object function NOT needed; just learning !!!
        this.part1 = part1;
        this.atsign = atsign;
        this.part2 = part2;
    }
    const myEMAIL = new Email("info", "@&nbsp;", "familyfoodfest.org");
	$(".emailAddress").html(myEMAIL.part1 + myEMAIL["atsign"] + myEMAIL.part2 + " <i class='fas fa-external-link-square-alt'></i>");  //  "tick marks syntax" ALSO valid:  $(".emailAddress").html(`${myEMAIL.part1}${myEMAIL.atsign}${myEMAIL.part2}`);

    $("p:empty").html("&copy; " + new Date().getFullYear() + " Family Food Fest Atlanta. <a href='pdf/fffa-privacypolicy.pdf' target='_blank'>Privacy&nbsp;Policy</a>");
	$("#send").on("click", validateForm);
});

function submitForm(token) { // the token argument also contains the recaptcha response ==> grecaptcha.getResponse()
    $.ajax({
        method: "POST",
        url: "php/fffa-contactus.php",
        //	data: $("#contactusform").serialize(),  // cannot use because captcha is NOT a form element (i.e. input, textarea or select)
        data: {
            firstname: $("#contfirstname").val().trim(),
            lastname: $("#contlastname").val().trim(),
            email: $("#contemail").val().trim(),
            phone: $("#contphone").val().trim(),
            message: $("#contmessage").val().trim(),
		    mailinglist: document.getElementById("contmailinglist").checked, // returns true OR false  // TODO: research how to use jQuery to check checkbox ==> mailinglist: $("#contmailinglist").checked;
            captcha: grecaptcha.getResponse()
        },
        success: function (results) {
            $("#contactusformerr").html("<i class='fas fa-spinner fa-pulse fa-lg'></i> loading . . .");
            setTimeout(function () {
                $("#contactusformerr").html(results);
                document.getElementById("contactusform").reset(); // TODO: research how to use jQuery to RESET form !!!!!!! ==> $("contactusform").reset();
                grecaptcha.reset(); // reset reCaptcha
            }, 3000);
        },
        error: function (xhr, statusText) {
            $("#contactusformerr").html("<i class='fas fa-spinner fa-pulse fa-lg'></i> loading . . .");
            setTimeout(function () {
                $("#contactusformerr").html("<span class='fas fa-exclamation-triangle'></span> System Error: " + xhr.status + " " + xhr.statusText);
            }, 3000);
        }
    });
}