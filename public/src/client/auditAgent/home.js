"use strict";

define("forum/auditAgent/home", ['api', 'jquery'], function (api, $) {
    const home = {};

    const sheetapi = "https://script.google.com/macros/s/AKfycbzdwrgTfkjEwKb96TPyaSZik3ayd6mCr0b5OKeXFvvUjAN5fAjWntFscJfQ4j-vatvh/exec"; // Replace with your Web App URL

    home.init = function () {
        const auditForm = $("#contact");

        auditForm.on("submit", function (event) {
            event.preventDefault();

            const fullName = $("#full-name").val();
            const email = $("#email").val();
            const subject = $("#subject").val();
            const message = $("#message").val();

            const formData = {
                name:fullName,
                email: email,
                subject: subject,
                message: message
            }
            console.log("data from the fe -->", fullName, email, subject, message)
            fetch(sheetapi, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    formData
                }),
            })
                .then(res => res.json())
                .then(data => console.log("✅ Success:", data))
                .catch(err => console.error("❌ Error:", err));
        });

        return home;
    };

    return home;
});
