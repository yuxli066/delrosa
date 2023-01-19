package email

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"log"
	"net/smtp"
	"os"
	"path/filepath"
	"strconv"
)

type EmailMessage struct {
	EMAIL_TYPE string
	TOEMAIL    string
	SUBJECT    string
	MESSAGE    struct {
		NAME           string
		MASSAGE_PARLOR string
		DATE           string
		TIME           string
		TYPE           string
		PRICE          int
	}
}

type Email struct {
	SERVER     *smtp.Client
	CERTPATH   string
	SERVERNAME string
	SERVERPORT int
	FROMEMAIL  string
	EMAIL      EmailMessage
}

type EmailSender interface {
	ConstructEmailMsg()
	GetHostname()
	GetServerUrl()
	SendHELO()
	Authenticate()
	AddCerts()
	SendMail()
	Execute()
}

func (e Email) ConstructEmailMsg() []byte {
	return []byte("To: " + e.EMAIL.TOEMAIL + "\r\n" +
		"Subject: " + e.EMAIL.SUBJECT + "\r\n" +
		"\r\n\r\n" +
		"Client Name: " + e.EMAIL.MESSAGE.NAME + "\r\n" +
		"Appointment Date: " + e.EMAIL.MESSAGE.DATE + "\r\n" +
		"Appointment Time: " + e.EMAIL.MESSAGE.TIME + "\r\n" +
		"Massage Type: " + e.EMAIL.MESSAGE.TYPE + "\r\n" +
		"Price: $" + strconv.Itoa(e.EMAIL.MESSAGE.PRICE) + "\r\n\r\n" +
		"Please note that this has been added to the calendar." +
		"\r\n")
}

func (e Email) Construct_Client_Email() []byte {
	return []byte("To: " + e.EMAIL.TOEMAIL + "\r\n" +
		"Subject: " + e.EMAIL.SUBJECT + "\r\n" +
		"\r\n\r\n" +
		"Hello " + e.EMAIL.MESSAGE.NAME + ",\r\n\n" +
		"Thank you for your reservation at " + e.EMAIL.MESSAGE.MASSAGE_PARLOR + ".\r\n\n" +
		"We are expecting you on " + e.EMAIL.MESSAGE.DATE + " at " + e.EMAIL.MESSAGE.TIME + "\r\n" +
		"We are looking forward to your visit and hope you will have a great massage experience with us!" + "\r\n\n" +
		"Below are the details to your appointment: " + "\r\n" +
		"Massage Type: " + e.EMAIL.MESSAGE.TYPE + "\r\n\n" +
		"Price: $" + strconv.Itoa(e.EMAIL.MESSAGE.PRICE) + "\r\n\r\n" +
		"\r\n")
}

func (e Email) GetHostname() string {
	hostname, err := os.Hostname()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	return hostname
}

func (e Email) GetServerUrl() string {
	log.Println("Server URL: " + e.SERVERNAME + ":" + strconv.Itoa(e.SERVERPORT))
	return e.SERVERNAME + ":" + strconv.Itoa(e.SERVERPORT)
}

func (e Email) Authenticate() {
	log.Println("Authenticating Email User...")
	err := e.SERVER.Auth(smtp.PlainAuth("", "paulli@delrosamassage.com", "hknmbfixxvzkwveo", "smtp.gmail.com"))
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func (e Email) AddCerts() {
	log.Println("Adding certificates to our server...")
	certs := x509.NewCertPool()
	workingDir, _ := os.Getwd()
	pemData, err := ioutil.ReadFile(filepath.Join(workingDir, e.CERTPATH))
	if err != nil {
		log.Println(err)
	}
	certs.AppendCertsFromPEM(pemData)
	config := &tls.Config{ServerName: e.SERVERNAME, InsecureSkipVerify: true} // fixme later, should not be insecure
	config.RootCAs = certs
	if err = e.SERVER.StartTLS(config); err != nil {
		log.Println("TLS ERROR:", err.Error())
	}
	state, _ := e.SERVER.TLSConnectionState()

	fmt.Printf("Handshake Complete : %v\n", strconv.FormatBool(state.HandshakeComplete))
	fmt.Printf("DidResume: %v\n", strconv.FormatBool(state.DidResume))

}

func (e Email) SendHELO() {
	log.Println("Sending HELO/EHLO to server")
	domainName := e.GetHostname()
	err := e.SERVER.Hello(domainName)
	if err != nil {
		log.Println("HELO/EHLO ERROR:", err.Error())
	}
}

func (e Email) SendMail() {
	log.Println("Sending email...")
	err := e.SERVER.Mail(e.FROMEMAIL)
	if err != nil {
		log.Println("MAIL ERROR:", err.Error())
	}
	err = e.SERVER.Rcpt(e.EMAIL.TOEMAIL)
	if err != nil {
		log.Println("RECEIPT ERROR:", err.Error())
	}
	emailData, err := e.SERVER.Data()
	if err != nil {
		log.Println("DATA ERROR:", err.Error())
	}

	if e.EMAIL.EMAIL_TYPE == "client" {
		_, err = emailData.Write([]byte(e.Construct_Client_Email()))
		if err != nil {
			log.Println("DATA WRITE ERROR:", err.Error())
		}
	} else if e.EMAIL.EMAIL_TYPE == "massage" {
		_, err = emailData.Write([]byte(e.ConstructEmailMsg()))
		if err != nil {
			log.Println("DATA WRITE ERROR:", err.Error())
		}
	}

	err = emailData.Close()
	if err != nil {
		log.Println("DATA CLOSE ERROR:", err.Error())
	}
	e.SERVER.Quit()
}

func (e Email) Execute() {
	e.SendHELO()
	e.AddCerts()
	e.Authenticate()
	e.SendMail()
}
