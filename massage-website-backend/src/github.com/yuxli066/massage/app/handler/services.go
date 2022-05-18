package handler

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
)

// smtpServer data to smtp server
type smtpServer struct {
	host string
	port string
}

// service configs
const fromEmail string = "delrosamassage1962@gmail.com"
const sendinBlueSMTPKey string = "xsYUHp52OK0mE9SD" // hide this

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
	var toEmails []string = getValidEmails()
	var emailServer = smtpServer{host: "smtp-relay.sendinblue.com", port: "587"} // using ssl not tls

	// Message.
	message := []byte("This is a really unimaginative message, I know.")

	// Authentication.
	auth := smtp.PlainAuth("", fromEmail, sendinBlueSMTPKey, emailServer.host)

	// Sending email.
	err := smtp.SendMail(emailServer.getServerAddress(), auth, fromEmail, toEmails, message)

	if err != nil {
		log.Println(err.Error())
		respondError(w, http.StatusInternalServerError, "Email Send Error")
		return
	}

	fmt.Println("Email Sent!")
	respondJSON(w, http.StatusOK, map[string]bool{"Email Sent": true})
}
