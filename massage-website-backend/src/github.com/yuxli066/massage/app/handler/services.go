package handler

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"path/filepath"
)

// smtpServer data to smtp server
type smtpServer struct {
	host string
	port string
}

// service configs
const fromEmail string = "paulli@delrosamassage.com" // hide this
const password string = "DelRosaMassage1962"         // hide this

// valid emails to email appointments to
func getValidEmails() []string {
	return []string{"yuxli066@gmail.com"}
}

// Address URI to smtp server
func (s *smtpServer) getServerAddress() string {
	return s.host + ":" + s.port
}

// API health check
func GetHealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Service is healthy!")
	respondJSON(w, http.StatusOK, map[string]bool{"success": true})
}

// Send appointment email out
func SendEmail(w http.ResponseWriter, r *http.Request) {
	// Receiver email addresses
	// Add client's email to receiver email too with confirmation
	// var toEmails []string = getValidEmails()
	// var emailServer = smtpServer{host: "smtp-relay.gmail.com", port: "587"} // using ssl not tls

	// Message.
	message := []byte("This is a really unimaginative message, I know.")

	// Authentication.
	// auth := smtp.PlainAuth("", fromEmail, password, "smtp-relay.gmail.com")

	c, err := smtp.Dial("smtp-relay.gmail.com:587")
	if err != nil {
		log.Println(err.Error())
	}
	defer c.Close()

	// send HELO/EHLO command to smtp server
	if err = c.Hello("delrosamassage.com"); err != nil {
		log.Println("HELO/EHLO ERROR:", err.Error())
	}
	// // send HELO/EHLO command to smtp server
	// if err = c.Hello(""); err != nil {
	// 	log.Println("HELO/EHLO ERROR:", err.Error())
	// }

	// add smtp certificate before making tls connection
	certs := x509.NewCertPool()
	workingDir, _ := os.Getwd()
	pemData, err := ioutil.ReadFile(filepath.Join(workingDir, "src/github.com/yuxli066/massage/certs/tlsCert.crt"))
	if err != nil {
		log.Println(err)
	}
	certs.AppendCertsFromPEM(pemData)
	config := &tls.Config{ServerName: "smtp-relay.gmail.com"}
	config.RootCAs = certs
	if err = c.StartTLS(config); err != nil {
		log.Println("TLS ERROR:", err.Error())
	}

	// Send Mail
	if err = c.Mail(fromEmail); err != nil {
		log.Println("MAIL ERROR:", err.Error())
	}
	if err = c.Rcpt("yuxli066@gmail.com"); err != nil {
		log.Println("RECEIPT ERROR:", err.Error())
	}
	emailData, err := c.Data()
	if err != nil {
		log.Println("DATA ERROR:", err.Error())
	}
	_, err = emailData.Write(message)
	if err != nil {
		log.Println("DATA WRITE ERROR:", err.Error())
	}
	err = emailData.Close()
	if err != nil {
		log.Println("DATA CLOSE ERROR:", err.Error())
	}

	// Authenticate SMTP server
	// if err = c.Auth(auth); err != nil {
	// 	log.Println("AUTHENTICATION ERROR:", err.Error())
	// }

	// if err != nil {
	// 	log.Println(err.Error())
	// 	respondError(w, http.StatusInternalServerError, "Email Send Error")
	// 	return
	// }

	fmt.Println("Email Sent!")
	respondJSON(w, http.StatusOK, map[string]bool{"Email Sent": true})
}

func getHostName() string {
	hostname, err := os.Hostname()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	return hostname
}
