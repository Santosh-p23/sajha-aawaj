import React from 'react'

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light d-print-none">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Sajha Aawaj</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#/listen">Listen</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#/record">Speak</a>
                </li>

                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#/speechtotext">Speech To Text</a>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
               
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#/downloads">Downloads</a>
                </li>
              </ul>
              
            </div>
          </div>
        </nav>
  )
}

export default Header