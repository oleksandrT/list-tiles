$(document).ready(function () {
    $.getJSON("http://leads.3shape.com/leadregistrator.asmx/getCountryList?callback=?", {
        tagmode: "any",
        format: "json"
    }).done(function (data) {

        var countries = data;
        for (var i = 0; i < countries.length; i++) {
            var option = document.createElement("option"); //createElement is the fastest way of creation
            option.setAttribute("value", countries[i].countryId);
            option.innerHTML = countries[i].countryName;
            $("[data-type='contact-reseller-country']").append(option);
        }

        $("[data-type='contact-reseller-country']").multiselect({
            buttonWidth: "100%",
            buttonClass: "btn btn-default contact-reseller-control",
            enableCaseInsensitiveFiltering: false,
            enableFiltering: true,
            numberDisplayed: 7,
            maxHeight: 200
        });
    });

    $("button[name='contact-send']").on("click", function () {
        var validated = false;
        var requiredFields = $("[required = 'required']");
        $.each(requiredFields, function (index, item) {
            if ($(item).val()) validated = true;
            else validated = false;
        });
        if ($("[data-type='contact-reseller-country']").find(":selected").val() != "Select country") validated = true;
        else {
            validated = false;
        }
        if (validated) {
            LeadsDeliverer({
                eventType: $("[name = 'prodInterest']").val() != "Other" ? "exhibition_mobile" : "filedownload",
                salutation: "",
                userFirstName: $("[name = 'name']").val(),
                userLastName: "",
                userCompany: "",
                jobtitle: "",
                campaign: "",
                userPhone: $("[name = 'phone']").val(),
                userCountry: $("[name = 'country']").find(":selected").val(),
                userEmail: $("[name = 'email']").val(),
                userState: "",
                city: "",
                zip: "",
                noemployees: "",
                iamfrom: "",
                havecadcam: "",
                scanner: "",
                haveintraoral: "",
                intraoral: "",
                newsletter: $("[name = 'sendNewsletter']").prop("checked") != undefined ? $("[name = 'sendNewsletter']").prop("checked") : "",
                leadpage: window.location.href,
                products: $("[name = 'prodInterest']").val(),
                prefreseller: "",
                userrequest: "",
                message: $("[name = 'message']").val()
            }, "", function () {
                $("[name='contact-reseller']").hide();
                $(".contact-success").show();
            });
        };
    });

});

var LeadsDeliverer = function (params, email, fSuccessCall) {
        var cookiePrefix = "userLead_";
        var userEmail;
        if (email != undefined && email != "") {
            userEmail = email;
        }
        else {
            userEmail = params.userEmail;
        }

        var newUserLeadDeliverer = {
            eventType: params.eventType,
            userEmail: userEmail,
            salutation: params.salutation,
            userFirstName: params.userFirstName,
            userLastName: params.userLastName,
            userCountry: params.userCountry,
            userState: params.userState,
            userCompany: params.userCompany,
            jobtitle: params.jobtitle,
            campaign: params.campaign,
            userPhone: params.userPhone,
            city: params.city,
            zip: params.zip,
            noemployees: params.noemployees,
            iamfrom: params.iamfrom,
            havecadcam: params.havecadcam,
            scanner: params.scanner,
            haveintraoral: params.haveintraoral,
            intraoral: params.intraoral,
            newsletter: params.newsletter,
            leadpage: params.leadpage,
            userrequest: params.userrequest,
            products: params.products,
            prefreseller: params.prefreseller,
            message: params.message,

            sendData: function () {
                $.ajax(
                    {
                        type: "GET",

                        url: "http://leads.3shape.com/leadregistrator.asmx/RegisterData",
                        data: {
                            leadType: this.eventType,
                            email: this.userEmail,
                            salutation: this.salutation,
                            firstname: this.userFirstName,
                            lastname: this.userLastName,
                            country: this.userCountry,
                            state: this.userState,
                            company: this.userCompany,
                            jobtitle: this.jobtitle,
                            phone: this.userPhone,
                            campaign: this.campaign,
                            city: this.city,
                            zip: this.zip,
                            noemployees: this.noemployees,
                            iamfrom: this.iamfrom,
                            havecadcam: this.havecadcam,
                            scanner: this.scanner,
                            haveintraoral: this.haveintraoral,
                            intraoral: this.intraoral,
                            newsletter: this.newsletter,
                            leadpage: this.leadpage,
                            userrequest: this.userrequest,
                            products: this.products,
                            prefreseller: this.prefreseller,
                            message: this.message
                        },
                        dataType: "jsonp",

                        success:
                            function (msg) {
                                if (msg.d == "true") {
                                    if (typeof fSuccessCall == "function") fSuccessCall();
                                    console.log('sent successfully');
                                }
                            },

                        error: function (jqXhr, exception) {
                            if (jqXhr.status === 0) {
                                alert("Not connect.\n Verify Network.");
                            } else if (jqXhr.status == 404) {
                                alert("Requested page not found. [404]");
                            } else if (jqXhr.status == 500) {
                                alert("Internal Server Error [500].");
                            } else if (exception === 'parsererror') {
                                alert("Requested JSON parse failed.");
                            } else if (exception === 'timeout') {
                                alert("Time out error.");
                            } else if (exception === 'abort') {
                                alert("Ajax request aborted.");
                            } else {
                                alert("Uncaught Error.\n" + jqXhr.responseText);
                            }
                        }

                    });
            }
        };

        newUserLeadDeliverer.sendData();

    }
