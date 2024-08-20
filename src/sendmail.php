<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/SMTP.php';
    require 'phpmailer/src/PHPMailer.php';

    $allowedExtensions = ['png', 'jpg', 'webp', 'gif', 'xls', 'xlsx', 'doc', 'docx', 'pdf'];

    // Данные из формы
    $EMAIL = trim($_POST['email']);
    $PHONE = trim($_POST['phone']);
    $THEME = trim($_POST['theme']);
    $NAME = trim($_POST['name']);
    $MESSAGE = trim($_POST['message']);

    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);

    try {
        //Server settings                    
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = 'smtp.mail.ru';                     //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = 'vs-expert.noreply@mail.ru';                     //SMTP username
        $mail->Password   = 'rrvqufzPnip8YSP2gwi8';                               //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
        $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        $mail->CharSet = 'UTF-8';                                 

        //Recipients
        $mail->setFrom('vs-expert.noreply@mail.ru', 'Заявки ВС-ЭКСПЕРТ');
        $mail->addAddress('vs-expert10@yandex.ru');     //Add a recipient
        $mail->addReplyTo($EMAIL, $NAME);

        if (!empty($_FILES['files'])) {
            $filesSend = true;
            foreach ($_FILES['files']['name'] as $key => $value) {
                $extension = pathinfo($_FILES['files']['name'][$key], PATHINFO_EXTENSION);
                if (in_array($extension, $allowedExtensions)) {
                    $out_files[] = array("name"=>$_FILES['files']['name'][$key], "tmp_name" => $_FILES['files']['tmp_name'][$key]);
                } else {
                    $filesSend = false;
                    break;
                }
            }
        } else {
            $filesSend = false;    
        }
        if ($filesSend) {
            foreach ($out_files as $file) {
                $mail->addAttachment($file['tmp_name'], $file['name']);
            }
        }

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = $THEME;
        $mail->Body    = '
            <h1>Пользователь оставил заявку</h1>
            <p><strong>Имя: </strong>'.$NAME.'</p>
            <p><strong>E-mail: </strong>'.$EMAIL.'</p>
            <p><strong>Номер телефона: </strong>'.$PHONE.'</p>
            <p><strong>Тема: </strong>'.$THEME.'</p>
            <p><strong>Сообщение: </strong>'.$MESSAGE.'</p>';

        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
?>