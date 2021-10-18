/**
 * Utilities for parsing an arbitrary string into the Optimade filter query.
 * An intermediate layer is the MPDS search query object notation.
 * The MPDS categories *formulae*, *elements*, *props*, *classes*, *lattices* are recognized.
 *
 * Author: Evgeny Blokhin /
 * Tilde Materials Informatics
 * eb@tilde.pro
 * Version: 0.0.1
 */
"use strict";

String.prototype.matchAll = function(regexp){
    var matches = [];
    this.replace(regexp, function(){
        var arr = ([]).slice.call(arguments, 0),
            extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr);
    });
    return matches.length ? matches : null;
}

String.prototype.replaceAll = function(search, replacement){
    return this.replace(new RegExp(search, 'g'), replacement);
}

String.prototype.endswith = function(searchString, position){
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length) position = subjectString.length;
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
}

Array.prototype.extend = function(other_array){
    other_array.forEach(function(v){ this.push(v) }, this);
}


var OptimadeNLP = function(){

    /*
     * Definitions
     */
    var stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "u", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"]; /* exact */

    stop_words.extend(['property', 'properties', 'constants', 'constant', 'diagrams', 'diagram', 'parameters', 'parameter', 'coefficients', 'coefficient', 'index', 'indeces', 'value', 'values', 'effect', 'effects', 'ratio', 'system', 'systems', 'compound', 'compounds']); /* fuzzy */

    var arity_keys = [null, 'unary', 'binary', 'ternary', 'quaternary', 'quinary', 'multinary', 'multinary', 'multinary', 'multinary', 'multinary']; // NB null is for "0-ary"

    var periodic_elements = ["h", "he", "li", "be", "b", "c", "n", "o", "f", "ne", "na", "mg", "al", "si", "p", "s", "cl", "ar", "k", "ca", "sc", "ti", "v", "cr", "mn", "fe", "co", "ni", "cu", "zn", "ga", "ge", "as", "se", "br", "kr", "rb", "sr", "y", "zr", "nb", "mo", "tc", "ru", "rh", "pd", "ag", "cd", "in", "sn", "sb", "te", "i", "xe", "cs", "ba", "la", "ce", "pr", "nd", "pm", "sm", "eu", "gd", "tb", "dy", "ho", "er", "tm", "yb", "lu", "hf", "ta", "w", "re", "os", "ir", "pt", "au", "hg", "tl", "pb", "bi", "po", "at", "rn", "fr", "ra", "ac", "th", "pa", "u", "np", "pu", "am", "cm", "bk", "cf", "es", "fm", "md", "no", "lr", "rg"]; /* exact */

    var periodic_elements_cased = periodic_elements.map(function(x){ return x[0].toUpperCase() + x.slice(1).toLowerCase() });

    var periodic_element_names = ["hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon", "sodium", "magnesium", "aluminium", "silicon", "phosphorus", "sulfur", "chlorine", "argon", "potassium", "calcium", "scandium", "titanium", "vanadium", "chromium", "manganese", "iron", "cobalt", "nickel", "copper", "zinc", "gallium", "germanium", "arsenic", "selenium", "bromine", "krypton", "rubidium", "strontium", "yttrium", "zirconium", "niobium", "molybdenum", "technetium", "ruthenium", "rhodium", "palladium", "silver", "cadmium", "indium", "tin", "antimony", "tellurium", "iodine", "xenon", "caesium", "barium", "lanthanum", "cerium", "praseodymium", "neodymium", "promethium", "samarium", "europium", "gadolinium", "terbium", "dysprosium", "holmium", "erbium", "thulium", "ytterbium", "lutetium", "hafnium", "tantalum", "tungsten", "rhenium", "osmium", "iridium", "platinum", "gold", "mercury", "thallium", "lead", "bismuth", "polonium", "astatine", "radon", "francium", "radium", "actinium", "thorium", "protactinium", "uranium", "neptunium", "plutonium", "americium", "curium", "berkelium", "californium", "einsteinium", "fermium", "mendelevium", "nobelium", "lawrencium", "roentgenium"]; /* fuzzy */

    var lat_p2i = {'cubic': 1, 'hexagonal': 2, 'trigonal': 3, 'tetragonal': 4, 'orthorhombic': 5, 'monoclinic': 6, 'triclinic': 7, 'rhombohedral': 3, 'cub': 1, 'hex': 2, 'hexag': 2, 'trig': 3, 'tet': 4, 'tetr': 4, 'tetrag': 4, 'orth': 5, 'ortho': 5, 'monocl': 6, 'tric': 7, 'tricl': 7, 'rhom': 3, 'rhomb': 3}
    var lat_fgrs = Object.keys(lat_p2i);
    var lat_i2p = {1:'cubic', 2:'hexagonal', 3:'trigonal', 4:'tetragonal', 5:'orthorhombic', 6:'monoclinic', 7:'triclinic'}

    var classes_fgrs = ["acetylenedicarboxylate", "acetylenediolate", "actinoid", "adamantane", "aegirine", "alkali", "alkaline", "allargentum", "almandine", "alum", "alunogen", "amide", "amidoborane", "amidophosphate", "amidosulfate", "amidothiophosphate", "aminooxidotetrazolate", "aminotetrazolate", "aminothiadiazolethiolate", "analcime", "anatase", "anorpiment", "anorthoclase", "antiferroelectric", "antiferromagnet", "antiferromagnetic", "arsenate", "arsenide", "ashcroftine", "auricupride", "aurocupride", "azide", "azobisoxidotetrazolate", "azobistetrazolate", "azoxybistetrazolate", "baileychlore", "bariopyrochlore", "baryte", "beryl", "biguanide", "binary", "birefringent", "bisoxidotetrazolate", "bistetrazolate", "biuretate", "borane", "borate", "borax", "boride", "borocarbide", "borohydride", "boronitride", "botryogen", "bromanilate", "bromide", "bromoimide", "calomel", "carbamate", "carbide", "carbonate", "carbonyl", "carbonyldiphosphonate", "carboxylate", "celestine", "celsian", "cesiokenopyrochlore", "chalcogen", "chevrel", "chloranilate", "chlorate", "chloride", "chloritoid", "chlorodifluoroacetate", "chloroimide", "chlorosulfate", "chlorotetrazolate", "chromate", "chrysoberyl", "chrysotile", "cinnabar", "clathrate", "clinochlore", "clinoclase", "clodronate", "conductor", "corundum", "cosmochlor", "croconate", "cryptomelane", "cuprate", "cuspidine", "cyamelurate", "cyanamide", "cyanamidonitrate", "cyananilate", "cyanide", "cyanotetrazolate", "cyanoureate", "cyanurate", "cyprine", "davyne", "deuteride", "deuterium", "devilline", "diamagnetic", "diamidophosphate", "diamidothiophosphate", "diaminotriazolate", "diamond", "diarsenate", "diaspore", "diazanide", "diazenide", "dibromoiodide", "dichloroiodide", "dichlorophosphate", "dichromate", "dicyanamide", "dicyanotriazolate", "difluorodioxoiodate", "difluorodiphosphate", "difluoronitrate", "difluorophosphate", "digermanate", "dihydrogenphosphide", "diiodobromide", "dinitramide", "dinitroacetonitrile", "dinitroguanidinate", "dinitromethyltetrazolate", "dinitroureate", "diopside", "dioptase", "dioxobromate", "dioxoiodate", "dioxosulfate", "dioxothiosulfate", "diphosphate", "diphosphonate", "dipolyhedral", "diselenate", "disilicate", "disordered", "disulfate", "dithiocarbamate", "dithiocarbonate", "dithionate", "dithiooxalate", "dithiophosphate", "dithiosquarate", "divanadate", "epidote", "euchlorine", "euclase", "eudialyte", "eulytine", "feroxihyte", "feroxyhyte", "ferrielectric", "ferrimagnet", "ferroelastic", "ferroelectric", "ferromagnet", "ferromagnetic", "fluorcalciopyrochlore", "fluoride", "fluornatropyrochlore", "fluoroborate", "fluorodioxoselenate", "fluorodiphosphate", "fluorophosphate", "fluorosulfate", "fluoroxosulfate", "fluorphosphohedyphane", "fulleride", "fulminate", "galena", "garnet", "gismondine", "glaucodot", "glaucophane", "grossular", "guanidinate", "gypsum", "hafnon", "halogen", "harmotome", "haueyne", "hedyphane", "helimagnet", "helvine", "hexaoxoiodate", "hexaoxotellurate", "hexasulfate", "hexathionate", "humboldtine", "hydrate", "hydrazinecarboxylate", "hydrazinedithiocarboxylate", "hydrazinoborane", "hydride", "hydrogenperoxide", "hydrokenopyrochlore", "hydropyrochlore", "hydroxide", "hydroxycalciopyrochlore", "hydroxylamide", "hydroxynatropyrochlore", "hypercinnabar", "hypophosphate", "ice", "imide", "imidodifluorosulfate", "imidodisulfonate", "iminate", "intercalation", "intermetallic", "iodate", "iodide", "iridium", "isoferroplatinum", "isopolyhedral", "kornerupine", "kosmochlor", "lanthanoid", "lavendulan", "levyne", "lime", "litharge", "lithiophosphate", "luminescent", "magnesiochloritoid", "magnetoelastic", "magnetoelectric", "manganate", "massicot", "mellitate", "melonate", "metacinnabar", "metal", "metalloid", "metamagnet", "metavoltine", "mica", "microcline", "microline", "mictomagnet", "minium", "molybdate", "monofluoroarsenate", "monothiooxalate", "multiferroic", "multinary", "nasicon", "natron", "natrophosphate", "natroxalate", "nepheline", "nickeline", "nickelphosphide", "niobocarbide", "niter", "nitranilate", "nitrate", "nitratine", "nitride", "nitriminotetrazolate", "nitroformate", "nitrosodisulfonate", "nitrotetrazolate", "nitrotetrazolefuroxane", "nonaflate", "nonmetal", "nordenskioeldine", "nosean", "olivine", "organic", "orpiment", "orthoborate", "orthoclase", "orthogermanate", "orthonitrate", "orthophosphate", "orthosilicate", "osmium", "oxalate", "oxamate", "oxide", "oxoiodate", "oxonitrate", "oxotetrazolate", "oxycalciopyrochlore", "ozonide", "palladogermanide", "paracelsian", "paramagnet", "pararealgar", "pentabromide", "pentafluorophenolate", "pentafluorophenylcarboxylate", "pentafluoropropionate", "pentafluorotellurate", "pentaoxoiodate", "pentasulfate", "pentathionate", "pentazolate", "perchlorate", "perchlorylamide", "perfluorobutoxide", "perhydrate", "periclase", "periodate", "permanganate", "pernitride", "peroxide", "peroxocarbonate", "peroxodicarbonate", "peroxodiphosphate", "pertechnetate", "phosphate", "phosphide", "phosphinate", "phosphohedyphane", "phosphonate", "phosphonoformate", "photocatalyst", "photovoltaic", "piezoelectric", "pnictogen", "polycrase", "potassic", "pseudorutile", "pyrochlore", "pyroelectric", "pyrope", "quadridavyne", "quartz", "quasicrystal", "quaternary", "quinary", "radioactive", "realgar", "refractory", "relaxor", "retzian", "rhodarsenide", "rhodizonate", "rhomboclase", "rocksalt", "rubicline", "rutheniridosmine", "rutherfordine", "rutile", "salammoniac", "sanidine", "sapphirine", "sarcopside", "schorl", "selenide", "selenidel", "selenocyanate", "semiconductor", "semimetal", "siderotil", "silanide", "silicate", "silicide", "skyrmion", "spessartine", "spinel", "spodumene", "squarate", "steenstrupine", "stibarsen", "sulfamate", "sulfamide", "sulfate", "sulfide", "sulfidel", "sulfinylamide", "superconductor", "superhard", "superoxide", "talc", "tantalcarbide", "tellurantimony", "telluride", "ternary", "tetrachlorophosphate", "tetracyanoethylene", "tetraferroplatinum", "tetrafluorochlorate", "tetrafluoroiodate", "tetraoxobromate", "tetraoxorhenate", "tetraoxoselenate", "tetraoxotellurate", "tetrasulfate", "tetrathiafulvalenetetracarboxylate", "tetrathionate", "tetrathiosquarate", "tetrazolecarboxylate", "thermoelectric", "thiocarbazate", "thiocyanate", "thiocyanurate", "thiophosphate", "thiosulfate", "topaz", "tourmaline", "transitional", "triazoledicarboxylate", "tribromide", "tribromoacetate", "trichloride", "trichloroacetate", "trichloroamidate", "trichloromethanesulfonate", "tricyanoborate", "tricyanoguanidinate", "tricyanomelaminate", "tricyanomethanide", "triflate", "trifluoroacetate", "trifluoromethylsulfonylsulfate", "triiodide", "trinepheline", "trinitromethyltetrazolate", "trinitrophloroglucinolate", "trinitropyrazolate", "trioxobromate", "trioxoperoxophosphate", "trioxoperoxosulfate", "trioxoselenate", "trioxotellurate", "tripolyhedral", "triselenocyanate", "trisulfate", "triteride", "trithionate", "trithiophosphate", "tritide", "tritium", "trona", "tungstate", "turquoise", "ulvoespinel", "unary", "uranophane", "uranopolycrase", "urate", "urea", "ureate", "vanadate", "violurate", "xenotime", "zincobotryogen", "zircon", "zircosulfate"];

    var props_fgrs = ["acceptor to donor concentration", "activation energy", "adiabatic bulk modulus", "angle-resolved photoelectron spectra", "band gap", "birefringence", "bremsstrahlung isochromat spectra", "charge carrier concentration", "charge carrier mobility", "charge transfer", "charge-density wave", "charge-transfer energy", "cie chromaticity coordinates", "coefficient of schottky term in heat capacity", "coercive electric field", "coercive field", "coherence length", "cohesive energy", "compressibility", "conductivity", "core-electron contribution to magnetic susceptibility", "critical current density", "critical magnetic field", "crystal electric field parameter", "crystal electric field parameters", "crystal electric field splitting", "crystal electric field", "crystal field level", "curie coefficient", "curie temperature", "curie-weiss paramagnetism", "debye temperature", "decomposition temperature", "decomposition", "diamagnetic contribution to magnetic susceptibility", "dielectric constant", "dielectric loss tangent", "diffusion", "donor concentration", "donor energy", "effective charge", "effective electron number", "effective mass of electrons to holes ratio", "effective mass of electrons", "effective mass", "einstein temperature", "elastic compliance", "elastic moduli", "elastic stiffness coefficient", "elasticity", "electric field gradient", "electric polarization", "electrical conductivity", "electrical properties", "electrical resistivity", "electrochemical impedance spectroscopy", "electron density maps", "electron density of states at fermi level", "electron density of states", "electron energy band structure", "electron energy loss spectra", "electron grueneisen coefficient", "electron mobility", "electron paramagnetic resonance spectra", "electron spin resonance spectra", "electron-phonon interaction parameter", "electronic contribution to heat capacity", "electronic contribution to thermal conductivity", "electronic energy gap", "electronic heat capacity coefficient", "electronic properties", "energy at fermi level", "energy band structure", "energy gap for direct transition", "energy gap for indirect transition", "energy level diagram", "energy of optical phonon", "energy product", "energy", "enthalpy change at melting point", "enthalpy change at phase transition", "enthalpy change at structural transition", "enthalpy change", "enthalpy of formation", "enthalpy of reaction", "enthalpy", "entropy change at melting point", "entropy change at phase transition", "entropy of formation", "entropy of reaction", "entropy", "eutectoid decomposition", "exchange field", "exchange interaction parameter", "exciton energy", "extended x-ray absorption fine structure", "extraordinary refractive index", "fermi energy", "fermi surface", "ferroelasticity", "ferroelectric curie temperature", "ferroelectric hysteresis", "ferroelectric neel temperature", "ferroelectric transitions", "field dependence of resistivity", "freezing temperature for spin glass", "fusion", "gibbs energy change", "gibbs energy of formation", "gibbs energy of reaction", "ginzburg-landau parameter", "grueneisen coefficients", "hall coefficient", "hall effect", "hall mobility", "hardness", "heat capacity at constant pressure", "heat capacity at constant volume", "heat capacity coefficients", "heat capacity discontinuity at structural transition", "heat capacity discontinuity at superconducting transition", "heat capacity discontinuity", "heat capacity", "high-frequency permittivity", "hole mobility", "hydrogen diffusion", "hyperfine magnetic field", "imaginary part of magnetic susceptibility", "imaginary part of permittivity", "inelastic neutron scattering", "inelastic x-ray scattering", "infrared spectra", "ionic conductivity", "irreversibility field", "isomer shift", "isothermal bulk modulus", "isothermal linear compressibility", "isothermal volume compressibility", "knoop hardness", "kondo behavior", "kondo temperature", "linear magnetostriction", "linear thermal expansion coefficient", "longitudinal sound velocity", "longitudinal-mode elastic coefficient", "lorentz number", "lower critical magnetic field", "lowest temperature of investigation", "luminescence lifetime", "luminescence", "magnetic anisotropy field", "magnetic anisotropy", "magnetic circular x-ray dichroism", "magnetic dichroism", "magnetic direction", "magnetic entropy", "magnetic field for magnetic transition", "magnetic field for structural transition", "magnetic heat capacity", "magnetic hysteresis", "magnetic moment", "magnetic order", "magnetic penetration depth", "magnetic phase diagram", "magnetic properties", "magnetic resistivity", "magnetic structure", "magnetic susceptibility", "magnetic transitions", "magnetism", "magnetization", "magneto-optical effects", "magneto-optical kerr effect", "magnetostriction", "mechanical properties", "melting temperature", "microhardness", "moessbauer spectra", "mohs hardness", "molar volume", "molecular field parameter", "muon spin spectra", "neel temperature", "neutron energy loss spectra", "non-linear optical properties", "non-linear optics", "nuclear magnetic resonance spectra", "nuclear quadrupolar resonance spectra", "optical absorption coefficient", "optical absorption", "optical conductivity", "optical phonons", "optical properties", "optical spectra", "orbital magnetic moment", "ordinary refractive index", "paraelectric curie coefficient", "paraelectric curie temperature", "paraelectric state", "paramagnetic curie temperature", "paramagnetic moment", "pauli magnetic susceptibility", "peritectic formation", "peritectoid formation", "permittivity", "perturbed angular correlation", "phase diagram", "phase transitions", "phonon contribution to thermal conductivity", "phonon density of states", "phonon dispersion", "phonon grueneisen coefficient", "phonon heat capacity at constant pressure", "phonons", "photo-conductivity data", "photo-conductivity", "photoelectron emission spectra", "photoluminescence spectra", "piezoelectric coefficient", "piezoelectric coefficients", "piezoelectricity", "plasma edge", "poisson ratio", "power factor", "pressure derivative of adiabatic bulk modulus", "pressure derivative of curie temperature", "pressure derivative of elastic stiffness coefficient", "pressure derivative of energy gap", "pressure derivative of isothermal bulk modulus", "pressure derivative of neel temperature", "pressure derivative of superconducting transition temperature", "pressure derivative of transition temperature", "pressure for magnetic transition", "pressure for metal-nonmetal transition", "pressure for structural transition", "pyroelectric coefficients", "pyroelectricity", "quadrupole splitting", "raman spectra", "real part of magnetic permeability", "real part of magnetic susceptibility", "real part of optical conductivity", "real part of permittivity", "reflectivity", "refractive index", "relative cooling power", "remanent induction", "remanent magnetic field", "remanent magnetic moment", "remanent magnetization", "remanent polarization", "residual resistivity ratio", "residual resistivity", "resistivity anisotropy", "resistivity", "resonance spectra", "saturation magnetic moment", "saturation magnetization", "second-harmonic generation", "seebeck coefficient", "shear modulus", "soft-x-ray emission spectra", "sound velocity", "spin contribution to magnetic susceptibility", "spin magnetic moment", "spin-fluctuation temperature", "spin-fluctuation", "spin-orbit splitting of valence band", "spin-resolved electron density of states at fermi level", "spontaneous elastic strain", "spontaneous magnetic moment", "spontaneous magnetization", "spontaneous polarization", "static permittivity", "stoner enhancement factor", "stoner parameter", "stoner product", "structural transition", "structural transitions", "superconducting transition temperature", "superconductivity energy gap", "superconductivity phenomena", "superconductivity", "temperature dependence of resistivity", "temperature dependence of static permittivity", "temperature derivative of elastic stiffness coefficient", "temperature derivative of energy gap", "temperature derivative of resistivity", "temperature derivative of upper critical magnetic field", "temperature for congruent melting", "temperature for eutectoid decomposition", "temperature for ferroelectric reordering", "temperature for magnetic transition", "temperature for metal-nonmetal transition", "temperature for peritectic formation", "temperature for peritectoid formation", "temperature for structural transition", "temperature-independent part of magnetic susceptibility", "thermal cell parameters change", "thermal conductivity", "thermal energy gap", "thermal expansion", "thermal properties", "thermal strain", "thermodynamic properties", "thermoelectric figure of merit", "thermoelectric power", "total energy calculation data", "transmittance", "transverse sound velocity", "type of magnetism", "upper critical magnetic field", "vacuum ultraviolet photoemission spectra", "valence", "van vleck contribution to magnetic susceptibility", "vibrational spectra", "vickers hardness number", "volume change at phase transition", "volume change at structural transition", "volume change", "volume magnetostriction", "volume thermal expansion coefficient", "wavelength for luminescence", "wavenumber of longitudinal optical phonon", "wavenumber of optical phonon", "wavenumber of transverse optical phonon", "work function", "x-ray absorption near-edge spectra", "x-ray absorption spectra", "x-ray photoemission spectra", "young modulus"];

    /*
     * Methods
     */
    function is_numeric(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /*
     * Fix chemical formula if needed
     */
    function termify_formulae(input, charred){
        if (input.indexOf('&#') > -1) charred = true;
        var re = charred ? /&#x208(\d);/g : /%u208(\d)/g;
        input = charred ? input : escape(input);
        var matches = input.matchAll(re);
        if (matches){
            for (var i = 0; i < matches.length; i++){
                input = input.replace(matches[i][0], matches[i][1]);
            }
        }
        return unescape(input).replace(/^\(|\)$/g, ""); //.replaceAll("\\[", "").replaceAll("\\]", "");
    }

    /*
     * User input processing
     */
    function is_like_chem_formula(chk){ // brute-force similarity check
        //console.log('Checking formula');
        var len = chk.length,
            checks;

        if (len > 10)
            return false; // this cannot be no-index chemical formula

        else if (len == 2){
            checks = [[chk.substr(0, 1), chk.substr(1, 1)]];

        } else if (len == 3){
            checks = [[chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 1)], [chk.substr(0, 1), chk.substr(1, 2)], [chk.substr(0, 2), chk.substr(2, 1)]];

        } else if (len == 4){
            checks = [[chk.substr(0, 2), chk.substr(2, 2)], [chk.substr(0, 2), chk.substr(2, 1), chk.substr(3, 1)], [chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 2)], [chk.substr(0, 1), chk.substr(1, 2), chk.substr(3, 1)], [chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 1), chk.substr(3, 1)]];

        } else if (len == 5){
            checks = [[chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 1)], [chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 2)], [chk.substr(0, 2), chk.substr(2, 2), chk.substr(4, 1)], [chk.substr(0, 1), chk.substr(1, 2), chk.substr(3, 2) ], [chk.substr(0, 1), chk.substr(1, 2), chk.substr(3, 1) ], [chk.substr(0, 2), chk.substr(2, 1), chk.substr(3, 1)], [chk.substr(0, 2), chk.substr(2, 1), chk.substr(3, 2)]];

        } else { // 6-9
            checks = [ // NB too improbable to have 5 one-symbol elements in row
                [chk.substr(0, 2), chk.substr(2, 2), chk.substr(4, 2)],                                     // El-El-El
                [chk.substr(0, 2), chk.substr(2, 1), chk.substr(3, 1), chk.substr(4, 2)],                   // El-E-E-El
                [chk.substr(0, 2), chk.substr(2, 1), chk.substr(3, 1), chk.substr(4, 1), chk.substr(5, 1)], // El-E-E-E-E
                [chk.substr(0, 2), chk.substr(2, 2), chk.substr(4, 1), chk.substr(5, 1)],                   // El-El-E-E
                [chk.substr(0, 2), chk.substr(2, 2), chk.substr(4, 1), chk.substr(5, 2)],                   // El-El-E-El
                [chk.substr(0, 2), chk.substr(2, 1), chk.substr(3, 2), chk.substr(5, 1)],                   // El-E-El-E
                [chk.substr(0, 2), chk.substr(2, 1), chk.substr(3, 2), chk.substr(5, 2)],                   // El-E-El-El
                [chk.substr(0, 1), chk.substr(1, 2), chk.substr(3, 1), chk.substr(4, 2)],                   // E-El-E-El
                [chk.substr(0, 1), chk.substr(1, 2), chk.substr(3, 1), chk.substr(4, 1), chk.substr(5, 1)], // E-El-E-E-E
                [chk.substr(0, 1), chk.substr(1, 2), chk.substr(3, 2), chk.substr(5, 1)],                   // E-El-El-E
                [chk.substr(0, 1), chk.substr(1, 2), chk.substr(3, 2), chk.substr(5, 2)],                   // E-El-El-El
                [chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 2), chk.substr(4, 1), chk.substr(5, 1)], // E-E-El-E-E
                [chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 2), chk.substr(4, 2)],                   // E-E-El-El
                [chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 1), chk.substr(3, 2), chk.substr(5, 1)], // E-E-E-El-E
                [chk.substr(0, 1), chk.substr(1, 1), chk.substr(2, 1), chk.substr(3, 1), chk.substr(4, 2)]  // E-E-E-E-El
            ];
        }
        //console.log(checks);

        for (var i = 0; i < checks.length; i++){
            var signals = 0;
            for (var j = 0; j < checks[i].length; j++){
                if (periodic_elements_cased.indexOf(checks[i][j]) > -1)
                    signals++;

                if (signals == checks[i].length){
                    //console.log(checks[i]);
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * Detect facets: formulae, elements, lattices, and some classes
     */
    function try_uniword_facet(term){

        if (term == 'AB' || term == 'ABC' || term == 'ABCD')
            return ['formulae']; // special case-sensitive anonymous cases

        term = term.toLowerCase();

        var dmatches = term.matchAll(/(\d)/g);
        if (dmatches && dmatches.length > 1)
            return ['formulae']; // no props with more than one digit

        var imatches = escape(term).matchAll(/%u208(\d)/g);
        if (imatches && imatches.length)
            return ['formulae']; // no props with subscripts

        if (periodic_elements.indexOf(term) !== -1) return ['elements'];
        else if (periodic_element_names.indexOf(term) !== -1) return ['elements', periodic_elements[ periodic_element_names.indexOf(term) ]];

        if (term.indexOf('-') !== -1){
            var parts = term.split('-'),
                excl = false;
            parts.forEach(function(part){
                if (periodic_elements.indexOf(part) == -1) excl = true;
            });
            if (!excl) return ['elements'];
        }

        if (['element', 'elements', 'elementary'].indexOf(term) > -1) return ['classes', 'unary'];
        else if (term == 'quinternary' || term == 'quinternaries' || term == 'pentanary' || term == 'pentanaries') return ['classes', 'quinary'];
        else if (term == 'actinide' || term == 'actinides') return ['classes', 'actinoid'];
        else if (term == 'lantanide' || term == 'lantanides' || term == 'lanthanide' || term == 'lanthanides' || term == 'lantanoid' || term == 'lantanoids') return ['classes', 'lanthanoid'];
        else if (term.endswith('ite') && term.length > 4) return ['classes'];

        var chk = term.replace(' structure', '').replace(' lattice', '').replace(' crystalline', '').replace(' crystal', '');
        if (lat_fgrs.indexOf(chk) !== -1) return ['lattices', lat_i2p[ lat_p2i[chk] ]];

        if (term.length <= 9 && dmatches) return ['formulae']; // no SHORT props with digits (NB L0, E1)

        return false;
    }

    /*
     * Detect facets: classes, props
     */
    function try_multiword_facet(term, queue){
        term = term.toLowerCase();

        var candidate = false,
            combined = false,
            orig = false;

        if (queue.length){
            orig = term;
            combined = true;
            queue.forEach(function(item){
                term = item.input + " " + term;
            });
        }
        //console.log("CHECKING TERM FOR MULTI-FACET: "+term);

        candidate = check_category(term, 'classes');
        if (candidate){
            if (combined) candidate.combined = true;
            return candidate;
        }

        candidate = check_category(term, 'props');
        if (candidate){
            if (combined) candidate.combined = true;
            return candidate;
        }

        var single_chk;
        if (term.endswith('s')){ // plural-singular fixups
            single_chk = term.substr(0, term.length-1);

            if (!combined && single_chk.endswith('ite')) return {'facet': 'classes', 'input': single_chk, 'ready': 1};

            candidate = check_category(single_chk, 'classes');
            if (candidate){
                if (combined) candidate.combined = true;
                return candidate;
            }
        }
        if (term.endswith('es')){ // plural-singular fixups
            single_chk = term.substr(0, term.length-2);

            if (single_chk == 'binari') single_chk = 'binary';
            else if (single_chk == 'ternari') single_chk = 'ternary';
            else if (single_chk == 'quaternari') single_chk = 'quaternary';

            candidate = check_category(single_chk, 'classes');
            if (candidate){
                if (combined) candidate.combined = true;
                return candidate;
            }
        }

        if (!candidate && orig) return try_multiword_facet(orig, []);
        return false;
    }

    /*
     * Utility algo
     */
    function check_category(term, category){
        var host = (category == 'classes') ? classes_fgrs : props_fgrs;

        if (host.indexOf(term) > -1) return {'facet': category, 'input': term, 'ready': 1};

        var i = 0,
            len = host.length,
            re = new RegExp('(?:^|\\s)(' + term + ')(?=\\s|$)'),
            idx;
        for (i; i < len; i++){
            idx = host[i].search(re);
            if (idx === 0){
                //console.log("Found unstrict match in "+category+" with <"+host[i]+">");
                return {'facet': category, 'input': term, 'anew': 1};
            }
        }
        return false;
    }

    /*
     * Chemical formula: ABC3 vs. SrTiO3
     */
    function is_formula_anonymous(formula){
        var detect = new RegExp(/A(\d{0,3})B(\d{0,3})(C(\d{0,3})(D(\d{0,3}))?)?\b/);
        return formula.charAt(0) === 'A' && detect.test(formula);
    }

    /*
     * User input processing: main algorithm
     */
    function guess(inputstr){

        // *pseudo_numerics*
        if (inputstr.indexOf('c/a ') > -1 || inputstr.indexOf('a/b ') > -1 || inputstr.indexOf('b/c ') > -1){ // FIXME slashes in names
            if (inputstr.indexOf('c/a ') > -1) inputstr = inputstr.replace('c\/a ', 'c--a ');
            if (inputstr.indexOf('a/b ') > -1) inputstr = inputstr.replace('a\/b ', 'a--b ');
            if (inputstr.indexOf('b/c ') > -1) inputstr = inputstr.replace('b\/c ', 'b--c ');
        }

        var tokens = inputstr.replaceAll('\\+|\\!|\\?', '').replaceAll(',|/', ' ').replaceAll('\<', ' < ').replaceAll('\>', ' > ').replaceAll('=', ' = ').split(/\s+/),
            result = {},
            n_terms = 0,
            n_toks = 1,
            queue = [],
            ignored = [];
        //console.log(tokens);
        // TODO: gracefully discard brackets

        tokens.forEach(function(input){
            var facet = false,
                simple = false;
            input = input.trim();

            if (input.indexOf('<') > -1 || input.indexOf('>') > -1 || input.indexOf('=') > -1 || is_numeric(input)){ // numeric searches
                if (input.indexOf('<') === 0 || input.indexOf('>') === 0 || input.indexOf('=') === 0){ // separated op sign
                    if (result.props){
                        if (!result.numeric) result.numeric = [];
                        result.numeric.push([result.props, input.substr(0, 1)]);
                        delete result.props;

                    } else if (result.numeric && result.numeric[result.numeric.length - 1]){
                        result.numeric[result.numeric.length - 1][1] = input.substr(0, 1); // TODO account <=, =<, >=, =>

                    } else ignored.push(input);

                } else if (is_numeric(input)){
                    if (result.props){
                        if (!result.numeric) result.numeric = [];
                        result.numeric.push([result.props, '=', parseFloat(input)]);
                        delete result.props;

                    } else if (result.numeric && result.numeric[result.numeric.length - 1]){
                        result.numeric[result.numeric.length - 1][2] = parseFloat(input); // NB no commas!
                        if (!result.numeric[result.numeric.length - 1][1]) result.numeric[result.numeric.length - 1][1] = '=';

                    } else ignored.push(input);
                }
                return;
            }

            if (!queue.length || (input != 'at' && input != 'in')){ // FIXME TODO special treatment, words vs. chemical symbols
                simple = try_uniword_facet(input);
            }

            if (simple){
                facet = simple[0];
                if (simple[1]) input = simple[1];
                if (queue.length && !queue[queue.length-1].ready) ignored.extend( queue.map(function(obj){ return obj.input }) );
                queue = [];
                //console.log(input + ": found simple facet " + simple[0]);

            } else {
                if (stop_words.indexOf(input) == -1){
                    input = input.replaceAll("\\(", "").replaceAll("\\)", "").replaceAll("\\[", "").replaceAll("\\]", "");

                    var candidate = try_multiword_facet(input, queue);
                    //console.log(candidate);

                    if (candidate.combined) queue = [];

                    if (candidate.ready){ // term found either alone or with previous
                        facet = candidate.facet;
                        input = candidate.input;
                        queue = [ candidate ];

                    } else if (candidate.anew){ // token anew
                        if (queue.length && !queue[queue.length-1].ready) ignored.extend( queue.map(function(obj){ return obj.input }) );
                        queue = [ candidate ];

                    } else if (!candidate){ // token unknown
                        if (queue.length && !queue[queue.length-1].ready) ignored.extend( queue.map(function(obj){ return obj.input }) );
                        queue = [];
                        if (is_like_chem_formula(input)){
                            facet = 'formulae';
                        }
                        if (!facet){
                            ignored.push(input);
                        }
                    }
                }
            }

            if (n_toks == tokens.length){ // token at the end, terminating
                if (queue.length && !queue[queue.length-1].ready) ignored.extend( queue.map(function(obj){ return obj.input }) );
                queue = [];
            }

            if (facet){
                if (facet == "formulae")
                    input = termify_formulae(input);

                if (result[facet]){ // What to do with the found term of the same category?
                    //console.log('Compare: '+result[facet]+' vs. '+input);

                    if (facet == "formulae"){
                        ignored.push(input);

                    } else if (facet == "elements"){
                        result[facet] += "-" + input;

                    } else if (facet == "classes"){
                        result[facet] += ", " + input; //escape(input);

                    } else if (facet == "props"){
                        if (input.indexOf(result[facet]) > -1){
                            //console.log('Smaller match '+result[facet]+' was thrown away');
                            result[facet] = input;

                        } else {
                            ignored.push(input);
                        }
                    }
                } else result[facet] = input; //escape(input);

                n_terms++;
            }
            n_toks++;
        });

        result.ignored = ignored;
        return result;
    }

    /*
     * Convert MPDS search query object notation into the Optimade filter
     */
    function to_optimade(parsed){

        var filter = [];

        ['formulae', 'elements', 'props', 'classes'].forEach(function(categ){
            if (!parsed[categ]) return;

            else if (categ == 'formulae'){
                if (is_formula_anonymous(parsed[categ]))
                    filter.push(`chemical_formula_anonymous="${parsed[categ]}"`);
                else
                    filter.push(`chemical_formula_reduced="${parsed[categ]}"`);
            }

            else if (categ == 'elements'){
                filter.push(`elements HAS ALL "${parsed[categ].split('-').join('","')}"`);
            }

            else if (categ == 'props'){
                filter.push(`_mpds_${parsed[categ].replaceAll(' ', '_')} IS KNOWN`);
            }

            else if (categ == 'classes'){
                parsed[categ].split(", ").forEach(function(item){
                    var arity = arity_keys.indexOf(item);
                    if (arity > 0)
                        filter.push(`nelements=${arity}`);
                });
            }
        });

        return filter.join(' AND ');
    }

    /*
     * API
     */
    return { guess, is_formula_anonymous, to_optimade };
}

if (typeof module !== 'undefined' && module.exports){
    module.exports = OptimadeNLP;
} else if (typeof require === 'function' && typeof require.specified === 'function'){
    define(function(){ return OptimadeNLP });
}
