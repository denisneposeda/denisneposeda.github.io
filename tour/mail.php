<?php
	$name = $_POST['name'];
	$email = $_POST['email'];
	$comment = $_POST['comment'];
	$phone = $_POST['phone'];
    $message = "Имя: ".$name."\nТелефон: ".$phone."\nE-mail: ".$email."\nКомментарий ".$comment."";
    $to = 'gynyax5@gmail.com';
    $subject = 'Хэй, кто-то хочет в ИСПАНИЮ. Глянь кто это.';
    mail($to, $subject, $message);
?>