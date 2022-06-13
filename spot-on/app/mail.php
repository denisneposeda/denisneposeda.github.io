<?php
	
	if ( isset($_POST['phone']) || !empty($_POST['phone']) ) {
		$sendto   = "mail@mail.by";
		$username = $_POST['name'];
		$usertel = $_POST['phone'];
		$subjectForm = $_POST['subject'];

		// Формирование заголовка письма
		$subject  = $subjectForm;
		$headers = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
		$headers .= 'From: Ford <mail@domen.by>' . " \r\n" .
								'Reply-To: '.  $useremail . "\r\n" .
		            'X-Mailer: PHP/' . phpversion();

		$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
		$msg .= "<div style='width: 100%; padding: 50px 30px; box-sizing: border-box; background: #000!important; color: #fff; '>";
		$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #fff; padding-bottom: 10px; margin-bottom: 20px;'>". $subjectForm ."</h2>\r\n";
		$msg .= "<table style='width: 100%;  border-collapse: collapse; margin-bottom: 30px;' border='1' cellpadding='10'>";
		$msg .= "<tr><th width='50%' colspan='2' style='text-align: left; padding-top: 10px; padding-bottom: 10px;'>Данные клиента</th></tr>";
		$msg .= "<tr><td width='50%'><b>ФИО</b></td><td>". $username ."</td></tr>";
		$msg .= "<tr><td width='50%'><b>Телефон</b></td><td>". $usertel ."</td></tr>";
		$msg .= "</table>";
		$msg .= "</div>";
		$msg ."</body></html>";

		// отправка сообщения
		@mail($sendto, $subject, $msg, $headers);
	}
?>
