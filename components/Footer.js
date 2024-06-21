import { faInstagramSquare, faLinkedin, faSquareFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faHome, faPhone, faPrint } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Footer(){
    return(
        <>
  <footer className="footer text-white text-center text-lg-start">
    <div className="container p-4">
      <div className="row mt-4">
        <div className="col-lg-4 col-md-12 mb-4 mb-md-0 d-sm-">
          <h5 className="text-uppercase mb-4">ABOUT TAKEIT</h5>
          <p>
          Your gateway to perfect bookings!
          </p>

          <p>
          A ticket booking website offers a convenient platform for users to purchase and manage tickets for various events. The website also provides features for managing bookings, such as canceling, modifying, or upgrading tickets, and obtaining refunds where applicable. Additional functionalities may include event recommendations, loyalty programs, and mobile app integration for on-the-go access.
          </p>

          <div className="mt-4 d-flex align-items-center justify-content-center justify-content-lg-start">
            <a href="https://www.facebook.com/"  Target="_blank" ><FontAwesomeIcon icon={faSquareFacebook} className='social-media-icons h5' /></a>
            <a href="https://www.instagram.com/" Target="_blank" > <FontAwesomeIcon icon={faInstagramSquare} className='social-media-icons h5'/></a>
            <a href="https://linkedin.com/" Target="_blank" ><FontAwesomeIcon icon={faLinkedin} className='social-media-icons h5' /></a>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4 pb-1">Ask something</h5>
          <ul className="fa-ul">
            <li className="mb-3">
              <span className="fa-li"><FontAwesomeIcon icon={faHome}/></span><span className="ms-2">Egypt</span>
            </li>
            <li className="mb-3">
              <span className="fa-li"><FontAwesomeIcon icon={faEnvelope}/></span><span className="ms-2">info@takeit.online</span>
            </li>
            <li className="mb-3">
              <span className="fa-li"><FontAwesomeIcon icon={faPhone}/></span><span className="ms-2">+2011 1862 3766</span>
            </li>
          </ul>
          <div className="mb-4  d-flex align-items-center justify-content-center justify-content-lg-start">
          <a className='golden-btn text-center' Target='_blank' href=''><p>chat <FontAwesomeIcon icon={faWhatsapp}/></p></a>
        </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4">Support Opening hours</h5>

          <table className="table text-center text-dark">
            <tbody className="font-weight-normal">
              <tr>
                <td>Mon - Thu:</td>
                <td>8:30am - 7pm</td>
              </tr>
              <tr>
                <td>Fri - Sat:</td>
                <td>8:30am - 7am</td>
              </tr>
              <tr>
                <td>Sunday:</td>
                <td>9am - 10pm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div className="text-center p-3 cp-right">
      © 2024 Copyright: TAKEIT
    </div>
  </footer>
  
        </>
    )
}
export default Footer