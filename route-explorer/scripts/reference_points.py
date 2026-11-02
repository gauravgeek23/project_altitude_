"""Hand-read positions in the original reference screenshot (circuits-map-original.webp, 1394x2000).

BASEMAP_DOTS: the basemap's own city markers (centre of the dot), matched to GeoNames.
LABELS: centre of each label box the author placed beside the route. The place itself is
taken as the nearest point on the traced route line to its label.
"""
BASEMAP_DOTS = {
    "Skardu": (30.0, 205.0),
    "Dharmsala": (269.5, 1362.5),
    "Jalandhar": (37.0, 1688.0),
    "Ludhiana": (125.0, 1840.0),
}

LABELS = {
    "siachen-bc": (720, 210), "panamik": (735, 337), "turtuk": (350, 363), "kargil": (217, 448),
    "diskit": (748, 459), "lamayuru": (368, 532), "khardung-la": (580, 532), "wari-la": (816, 580),
    "leh": (620, 605), "fotu-la": (395, 637), "durbuk": (904, 646), "satso-lake": (127, 713),
    "hemis": (640, 746), "chang-la": (820, 729), "pangong-tso": (1137, 768), "maan": (920, 801),
    "pensi-la": (227, 795), "zangla": (556, 818), "taglang-la": (668, 893), "padum": (380, 949),
    "lachalung-la": (633, 952), "nyoma": (987, 966), "nakee-la": (608, 1008), "tso-kar": (788, 1018),
    "photi-la": (1182, 1070), "gombo-ranjan": (409, 1080), "karzok": (942, 1098), "umling-la": (1231, 1139),
    "shinku-la": (440, 1158), "baralacha-la": (709, 1157), "tso-moriri": (914, 1176), "hanle": (1050, 1207),
    "demchok": (1288, 1213), "suraj-tal": (612, 1212), "darcha": (382, 1232), "chandratal": (787, 1246),
    "nurbula": (1146, 1258), "atal-tunnel": (405, 1298), "komik": (891, 1307), "gue": (996, 1344),
    "manali": (464, 1373), "kaza": (759, 1391), "tabo": (910, 1460), "mandi": (408, 1546),
    "jibhi": (644, 1556), "kalpa": (837, 1556), "nako": (1025, 1564), "sarahan": (763, 1669),
    "chitkul": (1015, 1715), "shimla": (530, 1739), "narkanda": (722, 1739), "solan": (573, 1848),
    "chandigarh": (298, 1919),
}

# Where each stop sits on the drawn line (read from the image; snapped to the nearest pixel
# of the circuit's colour). "@name" entries are unnamed junctions of the drawing.
PX = {
    "leh": (650, 648), "khardung-la": (676, 545), "diskit": (690, 495), "panamik": (630, 340),
    "siachen-bc": (536, 242), "turtuk": (419, 373), "wari-la": (742, 590), "hemis": (705, 728),
    "chang-la": (817, 661), "durbuk": (862, 680), "maan": (975, 800), "@changthang-fork": (1059, 991),
    "photi-la": (1128, 1052), "umling-la": (1222, 1140), "demchok": (1254, 1184), "hanle": (1090, 1165),
    "nurbula": (1145, 1215), "nyoma": (940, 975), "@tso-kar-fork": (858, 985), "taglang-la": (783, 935),
    "karzok": (864, 1084), "lachalung-la": (722, 990), "nakee-la": (673, 1028), "baralacha-la": (605, 1162),
    "darcha": (463, 1243), "atal-tunnel": (515, 1283), "manali": (510, 1395),
    "fotu-la": (400, 585), "lamayuru": (368, 583), "kargil": (207, 495), "satso-lake": (150, 665), "pensi-la": (300, 790),
    "padum": (437, 901), "zangla": (469, 826), "gombo-ranjan": (548, 1080), "shinku-la": (522, 1176),
    "mandi": (462, 1554), "chandigarh": (436, 1900),
    "chandratal": (720, 1280), "kaza": (805, 1368), "komik": (826, 1338), "tabo": (972, 1440),
    "gue": (951, 1371), "nako": (985, 1550), "kalpa": (880, 1592), "chitkul": (938, 1689),
    "sarahan": (740, 1600), "narkanda": (612, 1700), "shimla": (528, 1781), "solan": (510, 1844),
    "@aut": (547, 1546), "jibhi": (592, 1605),
}

# Control points for the warp: stops whose spot on the line is unambiguous (line ends and junctions).
CONTROL = ["kargil", "leh", "chandigarh", "padum", "darcha", "karzok", "mandi", "hanle", "chitkul",
           "solan", "shimla", "kaza", "atal-tunnel", "diskit", "nyoma", "taglang-la", "umling-la", "narkanda"]

# The circuits as drawn: each list is a run of stops along one stroke of the line.
DRAWN = {
    "nubra": [["leh", "khardung-la", "diskit"], ["diskit", "panamik", "siachen-bc"], ["diskit", "turtuk"],
              ["diskit", "wari-la", "hemis"], ["hemis", "leh"]],
    "changthang": [["leh", "hemis", "chang-la", "durbuk", "maan", "@changthang-fork"],
                   ["@changthang-fork", "photi-la", "umling-la", "demchok"],
                   ["@changthang-fork", "hanle", "nurbula", "demchok"],
                   ["taglang-la", "@tso-kar-fork", "nyoma", "@changthang-fork"], ["@tso-kar-fork", "karzok"],
                   ["taglang-la", "hemis"],
                   ["taglang-la", "lachalung-la", "nakee-la", "baralacha-la", "darcha", "atal-tunnel", "manali"]],
    "zanskar": [["leh", "fotu-la", "kargil", "satso-lake", "pensi-la", "padum"], ["padum", "zangla"],
                ["padum", "gombo-ranjan", "shinku-la", "darcha", "atal-tunnel", "manali", "mandi", "chandigarh"]],
    "spiti": [["atal-tunnel", "chandratal", "kaza", "tabo", "nako", "kalpa", "sarahan", "narkanda", "shimla", "solan", "chandigarh"],
              ["kaza", "komik"], ["tabo", "gue"], ["kalpa", "chitkul"],
              ["atal-tunnel", "manali", "@aut", "jibhi", "narkanda"]],
}
