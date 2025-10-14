"use strict";

define("forum/auditAgent/home", ['api', 'jquery'], function (api, $) {
    const home = {};

    home.init = function () {
        const auditForm = $("#contact");

        auditForm.on("submit", async function (event) {
            event.preventDefault();

            const fullName = $("#full-name").val();
            const email = $("#email").val();
            const subject = $("#subject").val();
            const message = $("#message").val();

            const formData = {
                name: fullName,
                email: email,
                subject: subject,
                message: message
            }
            // console.log("data from the fe -->", fullName, email, subject, message)


            try {

                await api.post("/agent/contact-us", formData);

                alert("✅ Form submitted successfully")

            } catch (error) {
                alert("Something Went Wrong")
            }

        });

        return home;
    };

    return home;
});
