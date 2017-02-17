/*

Data for testing conversion of orbital state vectors from Cartesian vectors to Keplerian elements (cart2kep)

*/

import moment from "moment";

function date(string) {
  return moment(string, "DD/MM/YYYY, HH:mm:ss.SSSSSS").toDate();
}

export default {

  // 1) Jason-2 Low Earth orbiter altimetry satellite, orbit data from precise orbit provider

  "jason-2": {

    GM: 398600.4415, // km^3/s^2

    cartesian: {
      r: [
        -7134.398648809276129,
        -1344.209105925399003,
        2616.198919025931575
      ],
      v: [
        2.737026697769760242,
        -2.641277223887037396,
        6.099438445144469672
      ]
    },

    time: date("16/12/2015, 09:00:32.184000"),

    keplerian: {
      a: 7719.637185686771549,
      e: 0.0004933931548963581687,
      i: 1.152688636308465185,
      ω: 1.161348667194184864,
      Ω: 3.167019390999958014,
      ν: 5.501897470565231553
    }
  },


  // 2) GPS IIR Medium Earth orbiter navigation satellite, orbit data from NASA Jet Propulsion Laboratory

  "gps-iir": {

    GM: 398600.4415, // km^3/s^2

    cartesian: {
      r: [
        -17662.41643,
        4031.322128,
        -19465.284702
      ],
      v: [
        0.41219989,
        -3.67984866,
        -1.12269641
      ]
    },

    time: date("29/02/2004, 21:00:51.184000"),

    keplerian: {
      a: 26559.45536811388409,
      e: 0.0028139222014726429,
      i: 0.9077268890773122381,
      ω: 0.06663686045640246166,
      Ω: 5.063017814062672041,
      ν: 4.266175869989886267
    }
  },


  // 3) Galileo IOV Medium Earth Orbiter navigation satellite, orbit data from ESA’s European Space Operations Centre

  "galileo-iov": {

    GM: 398600.4415, // km^3/s^2

    cartesian: {
      r: [
        1998.262166,
        26807.029665,
        -12370.888483
      ],
      v: [
        -2.2176139989,
        1.36088755712,
        2.5893515261
      ]
    },

    time: date("02/04/2014, 04:00:51.184000"),

    keplerian: {
      a: 29601.04674412769265,
      e: 0.0003642504036890733373,
      i: 0.9614657410409044464,
      ω: 5.29272150055702184,
      Ω: 1.823372879929565251,
      ν: 0.4555038029563247135
    }
  },


  // 4)	Intelsat 33E — Geostationary telecommunications satellite — orbit data from latest TLE

  "intelsat-33e": {

    GM: 398600.4415, // km^3/s^2

    cartesian: {
      r: [
        40568.021657,
        -2422.86491,
        58.47416
      ],
      v: [
        0.265204,
        3.17952,
        -6.933e-05
      ]
    },

    keplerian: {
      a: 42241.11780447884709,
      e: 0.04461501670143204985,
      i: 0.001439896472618427217,
      ω: 1.029490680250953739,
      Ω: 4.614079806539448909,
      ν: 0.5799621215309532638
    }
  }

};
