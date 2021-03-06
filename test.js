"use strict";

/*jshint esversion: 6, mocha: true */
/* global chai */

var expect, tz;

if (typeof chai === 'undefined') {
  expect = require("chai").expect;
  tz     = require("./");
} else {

  expect = chai.expect;
  tz     = require("tz-lookup");
}


function test(lat, lon, tzid) {
  it("should return \"" + tzid + "\" given " + lat + ", " + lon, () => {
    expect(tz(lat, lon)).to.equal(tzid);
  });
}

function errorTest(lat, lon) {
  it("should throw an error given " + lat + ", " + lon, () => {
    try {
      tz(lat, lon);
    }
    catch(ex) {
      expect(ex).
        to.have.a.property("message").
        that.equals("invalid coordinates");
      return;
    }
    throw new Error("Should not get here.");
  });
}

describe("tz-lookup", () => {
  before(done => tz.init(done));

  /* These tests are hand-crafted for specific locations. */
  test( 40.7092,  -74.0151, "America/New_York");
  test( 42.3668,  -71.0546, "America/New_York");
  test( 41.8976,  -87.6205, "America/Chicago");
  test( 47.6897, -122.4023, "America/Los_Angeles");
  test( 42.7235,  -73.6931, "America/New_York");
  test( 42.5807,  -83.0223, "America/Detroit");
  test( 36.8381,  -84.8500, "America/Kentucky/Monticello");
  test( 40.1674,  -85.3583, "America/Indiana/Indianapolis");
  test( 37.9643,  -86.7453, "America/Indiana/Tell_City");
  test( 38.6043,  -90.2417, "America/Chicago");
  test( 41.1591, -104.8261, "America/Denver");
  test( 35.1991, -111.6348, "America/Phoenix");
  test( 43.1432, -115.6750, "America/Boise");
  test( 47.5886, -122.3382, "America/Los_Angeles");
  test( 58.3168, -134.4397, "America/Juneau");
  test( 21.4381, -158.0493, "Pacific/Honolulu");
  test( 42.7000,  -80.0000, "America/Toronto");
  test( 51.0036, -114.0161, "America/Edmonton");
  test(-16.4965,  -68.1702, "America/La_Paz");
  test(-31.9369,  115.8453, "Australia/Perth");
  test( 42.0000,  -87.5000, "America/Chicago");
  test( 36.9147, -111.4558, "America/Phoenix");
  test( 46.1328,  -64.7714, "America/Moncton");
  // Cave Point County Park 44°55′50.8″N, 87°10′26.8″W
  test( 44.9308, -87.1741, "America/Chicago");
  // Whitefish Dunes State Park 44°55′40.7″N, 87°11′07.0″W
  test( 44.9280, -87.1853, "America/Chicago");
  // Port au Choix, NL, Canada
  test( 50.7029, -57.3511, "America/St_Johns");
  // Grand Canyon North Rim
  test( 36.2105, -112.0610, "America/Phoenix"); // North Rim
  test( 36.1170, -111.9501, "America/Phoenix"); // Cape Royal
  // Malören, Kalix Archipelago
  test( 65.5280,   23.5570, "Europe/Stockholm");
  // Sweden vs. Finnland islands
  test( 60.0961,   18.7970, "Europe/Stockholm"); // #23 (Grisslehamn)
  test( 59.9942,   18.7794, "Europe/Stockholm"); // #23 (Ortala)
  test( 59.0500,   15.0412, "Europe/Stockholm"); // #23 (Tomta)
  test( 60.0270,   18.7594, "Europe/Stockholm"); // #23 (Björkkulla)
  test( 60.0779,   18.8102, "Europe/Stockholm"); // #23 (Kvarnsand)
  test( 60.0239,   18.7625, "Europe/Stockholm"); // #23 (Semmersby)
  test( 59.9983,   18.8548, "Europe/Stockholm"); // #23 (Gamla Grisslehamn)

  // Saint-Germain-des-Vaux, France
  test( 49.7261,   -1.9104, "Europe/Paris");
  // Mexico Beach, FL
  test( 29.9414,  -85.4064, "America/Chicago");
  // Kingston, TN
  test( 35.8722,  -84.5250, "America/New_York");
  // Grand Portage, MN
  test( 47.9637,  -89.6848, "America/Chicago");
  // Paringa SA, Australia
  test( -34.1762,  140.7845, "Australia/Adelaide");

  /* Sanity-check international waters. */
  test(-65, -180, "Etc/GMT+12");
  test(-65, -165, "Etc/GMT+11");
  test(-65, -150, "Etc/GMT+10");
  test(-65, -135, "Etc/GMT+9");
  test(-65, -120, "Etc/GMT+8");
  test(-65, -105, "Etc/GMT+7");
  test(-65,  -90, "Etc/GMT+6");
  test(-65,  -75, "Etc/GMT+5");
  test(-65,  -60, "Etc/GMT+4");
  test(-65,  -45, "Etc/GMT+3");
  test(-65,  -30, "Etc/GMT+2");
  test(-65,  -15, "Etc/GMT+1");
  test(-65,    0, "Etc/GMT");
  test(-65,   15, "Etc/GMT-1");
  test(-65,   30, "Etc/GMT-2");
  test(-65,   45, "Etc/GMT-3");
  test(-65,   60, "Etc/GMT-4");
  test(-65,   75, "Etc/GMT-5");
  test(-65,   90, "Etc/GMT-6");
  test(-65,  105, "Etc/GMT-7");
  test(-65,  120, "Etc/GMT-8");
  test(-65,  135, "Etc/GMT-9");
  test(-65,  150, "Etc/GMT-10");
  test(-65,  165, "Etc/GMT-11");
  test(-65,  180, "Etc/GMT-12");

  /* Strings should be allowed. */
  test("42.3668",  "-71.0546", "America/New_York");
  test("21.4381", "-158.0493", "Pacific/Honolulu");

  /* Bizarre inputs should not. */
  errorTest(100, 10);
  errorTest(10, 190);
  errorTest("hello", 10);
  errorTest(10, "hello");
  errorTest(undefined, undefined);
  errorTest({lat: 10, lon: 10});

  /* These are automatically-generated test-cases just so I can be confident
   * when I change the data storage format all around. */
  test( 37.8358,  -89.0556, "America/Chicago");
  test(-29.3372,  -56.9745, "America/Argentina/Cordoba");
  test( 82.3141,  -39.1331, "America/Godthab");
  test( 54.1241,   95.1606, "Asia/Krasnoyarsk");
  test( 35.8970,  105.0863, "Asia/Shanghai");
  test( -3.6445,   24.5964, "Africa/Lubumbashi");
  test( 21.9200,   76.3888, "Asia/Kolkata");
  test( 81.0433,  -78.2488, "America/Iqaluit");
  test( 41.4793,   -2.7493, "Europe/Madrid");
  test( 16.5041,  103.0204, "Asia/Bangkok");
  test( 72.4750, -122.6775, "America/Yellowknife");
  test( 64.9576,  144.3597, "Asia/Srednekolymsk");
  test( 27.0518,  107.9761, "Asia/Shanghai");
  test( 20.2716,   28.7996, "Africa/Khartoum");
  test(-18.6123,  137.4460, "Australia/Darwin");
  test( 57.0724,  104.8747, "Asia/Irkutsk");
  test( 30.4075,  113.4049, "Asia/Shanghai");
  test( 67.9909,  164.1215, "Asia/Anadyr");
  test( 30.7623,  -84.0980, "America/New_York");
  test(  1.9845,  100.4508, "Asia/Jakarta");
  test( 69.3563,  -39.2451, "America/Godthab");
  test( 16.1784,  106.2894, "Asia/Vientiane");
  test( 22.1635,  -84.3358, "America/Havana");
  test( 65.9140,  -70.5960, "America/Iqaluit");
  test( 69.8885, -107.6005, "America/Cambridge_Bay");
  test( 39.2287,   32.3653, "Europe/Istanbul");
  test( 65.9913,   43.2401, "Europe/Moscow");
  test(-31.3366,  -57.4872, "America/Montevideo");
  test( 67.7696,  158.2245, "Asia/Srednekolymsk");
  test( -9.6156,   34.1749, "Africa/Blantyre");
  test( 65.8424,  -52.6658, "America/Godthab");
  test( 38.8582,  -78.9750, "America/New_York");
  test(-27.8742,  146.6473, "Australia/Brisbane");
  test( 45.9379,   62.7043, "Asia/Qyzylorda");
  test( 64.3534,   73.2775, "Asia/Yekaterinburg");
  test( 29.9944,  -99.8165, "America/Chicago");
  test( 29.1503,   23.8957, "Africa/Tripoli");
  test( 54.5334,   92.8278, "Asia/Krasnoyarsk");
  test( 64.9790,  -41.9666, "America/Godthab");
  test(-17.2287,   33.9961, "Africa/Maputo");
  test( 68.3552, -149.0941, "America/Anchorage");
  test( 40.8713,   86.7712, "Asia/Urumqi");
  test( 58.9104, -108.2242, "America/Regina");
  test( 63.9166,   56.0705, "Europe/Moscow");
  test( 54.7639,   41.9429, "Europe/Moscow");
  test( 81.8413,  -73.2339, "America/Iqaluit");
  test( -2.1921,   10.6367, "Africa/Libreville");
  test(  9.5718,  -83.1948, "America/Costa_Rica");
  test( 11.9618,  -71.7086, "America/Bogota");
  test( 65.5352,   74.4143, "Asia/Yekaterinburg");
  test( 50.5575,  -93.9996, "America/Winnipeg");
  test( 51.6740,  157.0986, "Asia/Kamchatka");
  test( 46.7376,  142.8907, "Asia/Sakhalin");
  test( 37.5756,  120.5804, "Asia/Shanghai");
  test( 32.7113,   74.3851, "Asia/Karachi");
  test(-24.4658,  -55.8260, "America/Asuncion");
  test( 24.1446,  113.9533, "Asia/Shanghai");
  test( 46.8222, -114.0462, "America/Denver");
  test( 60.6475,   66.0918, "Asia/Yekaterinburg");
  test( 64.5038,  -75.8160, "America/Iqaluit");
  test( 61.4801,   57.7244, "Asia/Yekaterinburg");
  test( 62.5267,   96.4454, "Asia/Krasnoyarsk");
  test(-25.1877,  139.8115, "Australia/Brisbane");
  test( 13.6274,   99.6599, "Asia/Bangkok");
  test( -9.6665,  -43.4782, "America/Bahia");
  test( 17.5016,   -8.0710, "Africa/Nouakchott");
  test( 64.1965, -116.9276, "America/Yellowknife");
  test( 74.0116,  -35.9084, "America/Godthab");
  test( 28.1819,   47.1326, "Asia/Riyadh");
  test(-25.8522,  139.7641, "Australia/Brisbane");
  test( 55.1606,   80.3125, "Asia/Novosibirsk");
  test( 58.5365,  -99.8847, "America/Winnipeg");
  test( 19.0721,   -0.7923, "Africa/Bamako");
  test( 51.7151,   84.7338, "Asia/Barnaul");
  test( 23.2615,   76.4792, "Asia/Kolkata");
  test( 46.7260,   79.0294, "Asia/Almaty");
  test( 54.2007, -121.4509, "America/Vancouver");
  test( 57.9166,   96.0225, "Asia/Krasnoyarsk");
  test( 19.8781,    9.8020, "Africa/Niamey");
  test( 65.0340, -155.4731, "America/Anchorage");
  test( 21.2294,  102.3456, "Asia/Vientiane");
  test( 31.3878,   97.7606, "Asia/Shanghai");
  test( 14.6321,   74.8661, "Asia/Kolkata");
  test( 73.9279,   56.0125, "Europe/Moscow");
  test( 61.0509,   79.4277, "Asia/Yekaterinburg");
  test( -5.8263,  -38.5891, "America/Fortaleza");
  test( 66.1051,  -44.2991, "America/Godthab");
  test( 61.9720, -122.8406, "America/Yellowknife");
  test( 50.7092,   98.1654, "Asia/Ulaanbaatar");
  test( 42.7892,  -80.2958, "America/Toronto");
  test( 20.1117,   53.8416, "Asia/Riyadh");
  test( 66.7761,  148.5291, "Asia/Srednekolymsk");
  test( -5.3391,   16.3601, "Africa/Kinshasa");
  test( 38.5756,   94.5492, "Asia/Shanghai");
  test( 27.3337,   40.2867, "Asia/Riyadh");
  test( 19.2194,   19.0398, "Africa/Ndjamena");
  test(  5.0789,   34.1745, "Africa/Juba");
  test( -0.9584,  -49.4351, "America/Belem");
  test( 57.1181,   69.5137, "Asia/Yekaterinburg");
  test(  9.0181,   27.4099, "Africa/Juba");
  test( 11.9072,   13.9995, "Africa/Lagos");
  test( 30.0807,  -93.3324, "America/Chicago");
  test(-23.3847,  -56.5457, "America/Asuncion");
  test( 39.8811,   26.3869, "Europe/Istanbul");
  test( 69.0819,   49.1753, "Europe/Moscow");
  test( 29.1968,   58.7977, "Asia/Tehran");
  test( 26.3241,  -11.1860, "Africa/El_Aaiun");
  test( 74.5094,  -46.1125, "America/Godthab");
  test(-18.0039,  137.1668, "Australia/Darwin");
  test(  3.1497,  -63.0510, "America/Boa_Vista");
  test( 36.0659,   98.8804, "Asia/Shanghai");
  test( 48.6762,   79.7838, "Asia/Almaty");
  test( 59.6321,   35.7763, "Europe/Moscow");
  test( 31.9457,  -89.0334, "America/Chicago");
  test( 45.4515,  -66.2694, "America/Moncton");
  test( 45.3159,   74.4388, "Asia/Almaty");
  test( 22.9471,   71.5664, "Asia/Kolkata");
  test( 39.4891,   29.9276, "Europe/Istanbul");
  test( 69.5459,  -40.9566, "America/Godthab");
  test(-25.1121,  -56.3599, "America/Asuncion");
  test( 58.6718,   71.7465, "Asia/Yekaterinburg");
  test( 38.7813, -105.5734, "America/Denver");
  test( 53.4450,   25.5964, "Europe/Minsk");
  test( 64.6617,  160.8968, "Asia/Magadan");
  test( 61.6405,   69.4836, "Asia/Yekaterinburg");
  test(-12.9104,   36.1809, "Africa/Maputo");
  test( 52.5127,  -65.5284, "America/Goose_Bay");
  test( -2.1186,   11.7021, "Africa/Libreville");
  test( 41.9794,  -93.6538, "America/Chicago");
  test( 59.3750,   40.2467, "Europe/Moscow");
  test( -6.1405,   27.0324, "Africa/Lubumbashi");
  test( 28.0069,   27.9217, "Africa/Cairo");
  test( 17.5589,   82.9606, "Asia/Kolkata");
  test( 77.0070,  -58.1725, "America/Godthab");
  test( 25.1439,   50.4092, "Asia/Riyadh");
  test( 13.5243,   26.5038, "Africa/Khartoum");
  test(-19.5728,  134.1770, "Australia/Darwin");
  test( 37.7332, -116.5272, "America/Los_Angeles");
  test(-30.6651,  120.3113, "Australia/Perth");
  test( 74.6277,  -33.1710, "America/Godthab");
  test( 53.6035,  -97.5722, "America/Winnipeg");
  test( 55.5158,   58.6481, "Asia/Yekaterinburg");
  test(-10.3277,   38.6084, "Africa/Dar_es_Salaam");
  test( 34.7560,   44.4394, "Asia/Baghdad");
  test( 62.6169,  103.2882, "Asia/Krasnoyarsk");
  test( -2.6981,  -73.2412, "America/Lima");
  test( -4.9274,  -65.3226, "America/Manaus");
  test( 71.1648, -117.7618, "America/Yellowknife");
  test( 39.9430,   95.8967, "Asia/Shanghai");
  test( 58.5594,   34.6095, "Europe/Moscow");
  test( 55.2956,   32.0908, "Europe/Moscow");
  test(-15.3693,   36.5350, "Africa/Maputo");
  test(-19.4016,   47.3511, "Indian/Antananarivo");
  test( 23.3162,   12.8176, "Africa/Niamey");
  test( 41.4247,  121.1758, "Asia/Shanghai");
  test( 49.0067,   17.4505, "Europe/Prague");
  test(-22.7467,  130.6468, "Australia/Darwin");
  test( 63.8349,  152.5360, "Asia/Magadan");
  test(-20.7583,  120.7570, "Australia/Perth");
  test( 36.4171,   87.8762, "Asia/Shanghai");
  test( 62.7709, -118.4994, "America/Yellowknife");
  test( 21.2630,   17.5662, "Africa/Ndjamena");
  test( 63.7417, -115.2235, "America/Yellowknife");
  test( 44.0343,  123.8136, "Asia/Shanghai");
  test( 81.6018,  -59.8101, "America/Godthab");
  test( 51.5641,  -63.8453, "America/Toronto");
  test(-38.1635,  -57.7626, "America/Argentina/Buenos_Aires");
  test( 36.1970, -107.8392, "America/Denver");
  test( 26.0985, -105.9614, "America/Monterrey");
  test( 32.3567,  113.1371, "Asia/Shanghai");
  test( 27.4785,   48.7596, "Asia/Riyadh");
  test( 41.5358,   69.8340, "Asia/Tashkent");
  test(-31.7125,  -60.6771, "America/Argentina/Cordoba");
  test( 55.3174, -111.7919, "America/Edmonton");
  test( 23.4918,   -4.6733, "Africa/Bamako");
  test( 23.4670,   42.9883, "Asia/Riyadh");
  test( 64.0877,   20.1457, "Europe/Stockholm");
  test( 29.3704,  106.9562, "Asia/Shanghai");
  test( 73.5927, -115.9105, "America/Yellowknife");
  test( 51.8279,  -84.3882, "America/Toronto");
  test( 56.5034, -108.7968, "America/Regina");
  test( 55.2477,   64.4429, "Asia/Yekaterinburg");
  test( 79.9054,  -80.5558, "America/Iqaluit");
  test( 68.1178,  137.7878, "Asia/Vladivostok");
  test( 75.4235,  140.6829, "Asia/Vladivostok");
  test( 25.1553,   30.5491, "Africa/Cairo");
  test( 57.5382,   69.7678, "Asia/Yekaterinburg");
  test( 19.2966,   13.2915, "Africa/Niamey");
  test(-29.3300,  -51.9941, "America/Sao_Paulo");
  test( 68.4663,  137.8967, "Asia/Vladivostok");
  test( 65.0498,   43.3195, "Europe/Moscow");
  test( 56.5933,   91.5732, "Asia/Krasnoyarsk");
  test( 63.4242,  153.9570, "Asia/Magadan");
  test( 60.5414,  102.2830, "Asia/Krasnoyarsk");
  test( 78.2319,  -35.9009, "America/Godthab");
  test( 50.4043,   20.1115, "Europe/Warsaw");
  test( 67.7007, -139.1173, "America/Whitehorse");
  test( 46.7656,   96.6875, "Asia/Hovd");
  test(-22.5825,   29.4276, "Africa/Johannesburg");
  test( 59.9827,   92.8622, "Asia/Krasnoyarsk");
  test( 32.2351,   74.7128, "Asia/Karachi");
  test( 81.5336,  -86.4839, "America/Rankin_Inlet");
  test( 77.1564,  -25.3151, "America/Godthab");
  test( 40.7495,   34.3622, "Europe/Istanbul");
  test( 34.2004,   91.9447, "Asia/Shanghai");
  test( 43.1564,  127.0682, "Asia/Shanghai");
  test(-12.6167,  -54.5727, "America/Cuiaba");
  test( 26.5547, -100.3505, "America/Monterrey");
  test( 43.4997,  118.0167, "Asia/Shanghai");
  test( 48.2616,   20.3343, "Europe/Budapest");
  test( 44.7708,   44.7429, "Europe/Moscow");
  test( 48.3448,  108.2238, "Asia/Ulaanbaatar");
  test( 54.1347, -123.4773, "America/Vancouver");
  test( 37.1042,   -8.4274, "Europe/Lisbon");
  test( 79.8894,   17.3457, "Arctic/Longyearbyen");
  test( 63.2507,  -46.7969, "America/Godthab");
  test( -1.9246,   29.0612, "Africa/Lubumbashi");
  test(-12.3557,  -53.4448, "America/Cuiaba");
  test(-27.3542,  -49.1180, "America/Sao_Paulo");
  test( 62.9927,   24.7490, "Europe/Helsinki");
  test( 76.0195,  -49.4057, "America/Godthab");
  test( 14.1445,    3.7444, "Africa/Niamey");
  test( 14.4858,   19.3595, "Africa/Ndjamena");
  test(  8.5186,   11.5768, "Africa/Lagos");
  test( 16.1586,   51.0247, "Asia/Aden");
  test( 56.5211,   46.9765, "Europe/Moscow");
  test( -0.8225,  122.7093, "Asia/Makassar");
  test( 71.7943,  142.9243, "Asia/Vladivostok");
  test( 53.4800,  102.6862, "Asia/Irkutsk");
  test( 54.4724,   35.8859, "Europe/Moscow");
  test( 42.6423,   47.3439, "Europe/Moscow");
  test( 21.3766,   -9.0809, "Africa/Nouakchott");
  test( 35.4466,   85.8077, "Asia/Shanghai");
  test( 15.3113,   32.8385, "Africa/Khartoum");
  test( -0.9303,  -61.5420, "America/Manaus");
  test( 65.1811,  -85.3929, "America/Atikokan");
  test( 41.3979,  109.2824, "Asia/Shanghai");
  test( 61.4208,  165.6336, "Asia/Kamchatka");
  test( 31.5990,  110.1621, "Asia/Shanghai");
  test(-25.9807,   26.9300, "Africa/Johannesburg");
  test( 61.7306,  -48.6246, "America/Godthab");
  test( 64.2152,  124.0541, "Asia/Yakutsk");
  test(-46.1385,  -72.9657, "America/Santiago");
  test( 15.8589,   24.5199, "Africa/Khartoum");
  test( 56.0054,   60.8903, "Asia/Yekaterinburg");
  test( 61.4232, -131.4265, "America/Whitehorse");
  test( 60.1848, -122.0054, "America/Yellowknife");
  test( 51.5442, -105.1728, "America/Regina");
  test( 43.8244,  -96.6180, "America/Chicago");
  test( 62.6568,   77.4446, "Asia/Yekaterinburg");
  test( 72.0346,  -32.6102, "America/Godthab");
  test( 14.0688,  -13.6619, "Africa/Dakar");
  test( 79.5181,  -25.8663, "America/Godthab");
  test( 59.8240,   37.2919, "Europe/Moscow");
  test( 47.2100,  122.8452, "Asia/Shanghai");
  test(  9.1754,  -76.0658, "America/Bogota");
  test( -3.3148,   38.7519, "Africa/Nairobi");
  test(-30.8390,  -61.0529, "America/Argentina/Cordoba");
  test( 77.3716,  -56.5280, "America/Godthab");
  test( 25.4612,   16.3495, "Africa/Tripoli");
  test( 49.2977, -125.2356, "America/Vancouver");
  test( 18.4695,   27.3104, "Africa/Khartoum");
  test( 65.4723,  167.7756, "Asia/Anadyr");
  test( 53.0989,   40.2981, "Europe/Moscow");
  test( 46.0498, -119.7057, "America/Los_Angeles");
  test( 33.4187,   40.2683, "Asia/Baghdad");
  test( 46.6549,   33.7897, "Europe/Kiev");
  test( 67.5675,  115.0571, "Asia/Yakutsk");
  test( 54.2140,   45.7523, "Europe/Moscow");
  test(-15.4168,   27.5488, "Africa/Lusaka");
  test( 72.0585,   94.0572, "Asia/Krasnoyarsk");
  test( 43.7057,  -79.6802, "America/Toronto");
  test( 68.7574,   27.1326, "Europe/Helsinki");
  test( 47.9892,  138.5052, "Asia/Vladivostok");
  test( 49.5039,  106.2301, "Asia/Ulaanbaatar");
  test( 47.1250,   86.2943, "Asia/Urumqi");
  test(-30.7504,  -65.1035, "America/Argentina/Cordoba");
  test( 73.0064,   98.4606, "Asia/Krasnoyarsk");
  test( 72.9200,  -53.8420, "America/Godthab");
  test( 33.9540,  -84.6719, "America/New_York");
  test( 70.2102,  109.2729, "Asia/Krasnoyarsk");
  test( 14.5076,   76.2365, "Asia/Kolkata");
  test( 29.1668,   28.7916, "Africa/Cairo");
  test( -6.3410,   16.0039, "Africa/Luanda");
  test( 15.7965,   18.3872, "Africa/Ndjamena");
  test( -7.7214,  140.5180, "Asia/Jayapura");
  test( 23.8358,   14.1805, "Africa/Tripoli");
  test( 56.1999,  114.3054, "Asia/Irkutsk");
  test( 40.6756,   -3.1529, "Europe/Madrid");
  test( 46.6208, -110.5776, "America/Denver");
  test( 33.8164,   -4.3187, "Africa/Casablanca");
  test( 19.4155,  -70.3931, "America/Santo_Domingo");
  test( 63.9662,   27.2907, "Europe/Helsinki");
  test( 30.4291,   -7.3296, "Africa/Casablanca");
  test(-12.6378,  -57.5000, "America/Cuiaba");
  test( 26.8727,  109.0441, "Asia/Shanghai");
  test( -3.9646,  -73.4212, "America/Lima");
  test(-18.8768,  123.5026, "Australia/Perth");
  test( -3.2149,  -60.7691, "America/Manaus");
  test( 56.0306,   96.2819, "Asia/Krasnoyarsk");
  test( 61.3456, -154.6022, "America/Anchorage");
  test( 17.0363,   80.1072, "Asia/Kolkata");
  test( 32.9800,  -84.4394, "America/New_York");
  test( 69.7465,   88.1611, "Asia/Krasnoyarsk");
  test(-24.7776,  133.3335, "Australia/Darwin");
  test( 52.2638,   23.4595, "Europe/Minsk");
  test(  6.0803,   33.7236, "Africa/Juba");
  test( 46.2339,  118.3615, "Asia/Shanghai");
  test(-31.8517,   19.9454, "Africa/Johannesburg");
  test( 28.4657,  110.0877, "Asia/Shanghai");
  test( 40.1297,   63.6307, "Asia/Samarkand");
  test(-19.1731,   14.5112, "Africa/Windhoek");
  test( 56.6561,   54.9217, "Asia/Yekaterinburg");
  test( 48.5194,   62.6996, "Asia/Aqtobe");
  test( 15.0813,  102.2842, "Asia/Bangkok");
  test( -2.9155,  104.5851, "Asia/Jakarta");
  test( 20.8734,   13.1134, "Africa/Niamey");
  test( 30.7539,    4.9642, "Africa/Algiers");
  test( 51.2865,  121.6765, "Asia/Shanghai");
  test( 18.4527,    3.0800, "Africa/Bamako");
  test(-12.9176,  -51.8294, "America/Cuiaba");
  test( -9.8941,   31.4986, "Africa/Lusaka");
  test( 51.1884,   72.5447, "Asia/Almaty");
  test( 50.1720,  109.3305, "Asia/Chita");
  test( 31.6023,  -81.5271, "America/New_York");
  test(-34.9033,  -64.2808, "America/Argentina/Cordoba");
  test( 11.9140,   -1.7697, "Africa/Ouagadougou");
  test( 25.2369,  115.3962, "Asia/Shanghai");
  test( 68.4210,  152.2690, "Asia/Srednekolymsk");
  test( 46.9954,  102.2327, "Asia/Ulaanbaatar");
  test( 46.4199,  127.2178, "Asia/Shanghai");
  test(  7.5015,   41.0239, "Africa/Addis_Ababa");
  test( 49.8186,   90.2840, "Asia/Hovd");
  test( 56.5580, -104.9026, "America/Regina");
  test(  1.3163,  -70.7942, "America/Bogota");
  test(-15.0202,  127.2482, "Australia/Perth");
  test( 20.7633,    3.2933, "Africa/Algiers");
  test( 58.7958,   56.7150, "Asia/Yekaterinburg");
  test( 57.3421,  -98.0511, "America/Winnipeg");
  test(  3.6109,  -73.4326, "America/Bogota");
  test(  6.3923,   -6.7531, "Africa/Abidjan");
  test( 31.3301,   60.7153, "Asia/Tehran");
  test( 50.3759,    7.5712, "Europe/Berlin");
  test(  1.7587,   34.0083, "Africa/Kampala");
  test(-26.7159,  149.7563, "Australia/Brisbane");
  test( 44.2626,   44.7455, "Europe/Moscow");
  test( 59.8934, -129.0060, "America/Vancouver");
  test( -0.6722,  -77.7137, "America/Guayaquil");
  test( 28.0058,  109.1947, "Asia/Shanghai");
  test( 45.3270, -111.0269, "America/Denver");
  test(-21.4916,   18.2277, "Africa/Windhoek");
  test( 69.8075,  -36.7877, "America/Godthab");
  test( 62.4056,   40.1308, "Europe/Moscow");
  test( 35.6780,  -85.8903, "America/Chicago");
  test( -5.2175,  -55.5735, "America/Santarem");
  test( 19.3533,   73.4849, "Asia/Kolkata");
  test( 69.7972,  -50.0355, "America/Godthab");
  test( 37.2952,   90.9628, "Asia/Shanghai");
  test( 14.7315,   20.6226, "Africa/Ndjamena");
  test(-11.9026,   19.1156, "Africa/Luanda");
  test(-19.0649,  -52.4491, "America/Campo_Grande");
  test( 61.3513, -148.3128, "America/Anchorage");
  test( 73.8546, -120.2774, "America/Yellowknife");
  test( 69.4978,  156.2309, "Asia/Srednekolymsk");
  test( 23.2705,   87.0558, "Asia/Kolkata");
  test( 15.9273,  -92.0672, "America/Mexico_City");
  test( 67.4221,  -51.8146, "America/Godthab");
  test(-20.2422,  -40.7203, "America/Sao_Paulo");
  test( 59.0311, -126.9869, "America/Vancouver");
  test( 14.8675,   76.3773, "Asia/Kolkata");
  test(-26.1632,   16.0042, "Africa/Windhoek");
  test( 65.1068,  -87.7971, "America/Rankin_Inlet");
  test( -1.2604,   17.7737, "Africa/Kinshasa");
  test( 26.2379,   12.8011, "Africa/Tripoli");
  test( 33.2165,  114.4249, "Asia/Shanghai");
  test(  3.7725,   21.4347, "Africa/Kinshasa");
  test(  1.5147,  116.9022, "Asia/Makassar");
  test( 21.2209,   54.6444, "Asia/Riyadh");
  test(-18.5604,   13.7071, "Africa/Windhoek");
  test( 73.3086,  -50.3401, "America/Godthab");
  test( 66.0904,  141.2401, "Asia/Srednekolymsk");
  test( 57.5957,   83.7790, "Asia/Tomsk");
  test( 62.4294, -160.5397, "America/Anchorage");
  test(  5.2829,   35.5583, "Africa/Juba");
  test( 52.1639,  -71.8402, "America/Toronto");
  test( 38.9473,   90.3155, "Asia/Urumqi");
  test( 49.7176, -120.6521, "America/Vancouver");
  test( 25.6025,  -99.0005, "America/Monterrey");
  test( 67.5031,  -38.0278, "America/Godthab");
  test( 42.6345,   95.3104, "Asia/Urumqi");
  test( 43.4929,   78.0778, "Asia/Almaty");
  test( 58.7754, -120.0701, "America/Fort_Nelson");
  test(  0.1582,  -77.8423, "America/Guayaquil");
  test( 60.8634, -131.1674, "America/Whitehorse");
  test( -2.3241,  -65.9156, "America/Manaus");
  test( 51.2849,   31.5151, "Europe/Kiev");
  test( -0.6626,   17.8965, "Africa/Kinshasa");
  test( 73.2245,  -96.8935, "America/Rankin_Inlet");
  test( 32.3177,   46.9431, "Asia/Baghdad");
  test( 43.5323,   65.9852, "Asia/Qyzylorda");
  test( 21.9848,  -79.4824, "America/Havana");
  test(  3.1742,   29.6364, "Africa/Lubumbashi");
  test( 45.4705,  135.6598, "Asia/Vladivostok");
  test( 52.9221,  101.7918, "Asia/Irkutsk");
  test( 18.1641,   18.4528, "Africa/Ndjamena");
  test(  8.6146,  -65.2355, "America/Caracas");
  test( 37.3193,  102.0327, "Asia/Shanghai");
  test( -6.6831,   22.1025, "Africa/Lubumbashi");
  test( 64.1049,   89.7467, "Asia/Krasnoyarsk");
  test(-28.1880,  119.3906, "Australia/Perth");
  test(-23.5594,  142.2289, "Australia/Brisbane");
  test( 22.4934,  -12.2664, "Africa/Nouakchott");
  test( 17.1192,  -12.8761, "Africa/Nouakchott");
  test( 51.4541,   43.3003, "Europe/Saratov");
  test( 15.1609,   76.2168, "Asia/Kolkata");
  test( 60.0202,   89.4423, "Asia/Krasnoyarsk");
  test( 41.8693,   -5.9326, "Europe/Madrid");
  test(  4.2187,  -62.7399, "America/Caracas");
  test( 69.5304,   85.2865, "Asia/Krasnoyarsk");
  test( 36.6934,  113.5059, "Asia/Shanghai");
  test( 17.4480,   49.6467, "Asia/Aden");
  test( 46.8508,  -75.1992, "America/Toronto");
  test( 71.4531,  -46.1878, "America/Godthab");
  test( 14.5328,   20.0108, "Africa/Ndjamena");
  test( 49.0779,  105.2610, "Asia/Ulaanbaatar");
  test(-10.7260,  -66.9046, "America/La_Paz");
  test( 31.2644,   21.7824, "Africa/Tripoli");
  test( 57.2329,   94.6034, "Asia/Krasnoyarsk");
  test( 12.6608,  -87.2430, "America/Managua");
  test( 63.4155, -109.7556, "America/Yellowknife");
  test( 41.8814, -113.9326, "America/Denver");
  test(  8.1392,   80.1801, "Asia/Colombo");
  test( 53.9195,  107.1539, "Asia/Irkutsk");
  test( 29.5765,   28.8024, "Africa/Cairo");
  test( 34.1592,   95.6204, "Asia/Shanghai");
  test( 75.7569,  -40.2910, "America/Godthab");
  test( 54.6688, -115.0705, "America/Edmonton");
  test( -8.8954,  -38.3336, "America/Recife");
  test( 67.2404,   94.0746, "Asia/Krasnoyarsk");
  test( 73.9764,   56.1288, "Europe/Moscow");
  test( 58.4602,   25.1753, "Europe/Tallinn");
  test( 28.7239,   27.2395, "Africa/Cairo");
  test( 75.2983,   99.6727, "Asia/Krasnoyarsk");
});
