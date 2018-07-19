(function ($) {
    'use strict';

    if (typeof window.firebaseOptions !== 'undefined') {

        // Initialize FirebaseApp
        if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseOptions);
        }

        $(document).ready(function () {
            // Firebase login
            $(document).on("click", "#firebase-form-submit", function (event) {
                event.preventDefault();
                let data = $('#firebase-login-form :input').serializeArray();
                let email = data[0].value;
                let password = data[1].value;

                // start login into firebase
                if (email !== '' && password !== '') {
                    firebase.auth().signInWithEmailAndPassword(email, password)
                            .then(result => {
                                emailExists(result.user.email);
                                //createUser(data.user.email);
                            }).catch(error => {
                                switch(error.code) {
                                    case "auth/wrong-password":
                                        alert(error.message);
                                    case "auth/user-not-found":
                                        alert(error.message);
                                }
                            })
                } else {
                    alert('Your email or password is missing!');
                }
            });

            // Sign out action
            $(document).on("click", "#firebase-signout", e => {
                e.preventDefault();
                firebase.auth().signOut()
                        .then(() => {
                        })
                        .catch(error => {
                            console.log(error.message)
                        })
            })

            function createUser(email) {
                $.ajax({
                    url: wpApiSettings.root + "wp/v2/users",
                    method: "POST",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-WP-Nonce", wpApiSettings.nonce);
                    },
                    data: {
                        email: email,
                        username: email
                    }
                }).done(function (response, textStatus, jqXHR) {
                    console.log(response);
                    //console.log(response);
                }).fail(function(jqXHR, textStatus, errorThrown){
                    alert(jqXHR.responseJSON.message);
                });
            }
            
            // ワードプレスにメールアドレスが登録されているかチェック
            function emailExists(email){
                $.ajax({
                    url: wpApiSettings.root + "my-rest/v1/user",
                    method: "POST",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-WP-Nonce", wpApiSettings.nonce)
                    },
                    data: {
                        email: email
                    }
                }).done(function(response, textStatus, jqXHR){
                    console.log(response);
                    location = "/"
                }).fail(function(jqXHR, textStatus, errorThrown){
                    alert(jqXHR.responseJSON.message);
                });
            }
        })
    } else {
        console.warn('Please enter your Firebase settings!');
    }
})(jQuery)
