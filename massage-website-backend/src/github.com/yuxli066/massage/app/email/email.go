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

type Email struct {
	SERVER     *smtp.Client
	CERTPATH   string
	SERVERNAME string
	SERVERPORT int
	FROMEMAIL  string
	TOEMAILS   []string
	MESSAGE    string
}

type EmailSender interface {
	GetHostname()
	GetServerUrl()
	SendHELO()
	AddCerts()
	SendMail()
	Execute()
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
	err = e.SERVER.Rcpt("yuxli066@gmail.com")
	if err != nil {
		log.Println("RECEIPT ERROR:", err.Error())
	}
	emailData, err := e.SERVER.Data()
	if err != nil {
		log.Println("DATA ERROR:", err.Error())
	}
	_, err = emailData.Write([]byte(e.MESSAGE))
	if err != nil {
		log.Println("DATA WRITE ERROR:", err.Error())
	}
	err = emailData.Close()
	if err != nil {
		log.Println("DATA CLOSE ERROR:", err.Error())
	}
}

func (e Email) Execute() {
	e.SendHELO()
	e.AddCerts()
	e.SendMail()
}
