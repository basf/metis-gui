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

/*
 * Own matchAll used for the chemical formulae
 */
function getMatchAll(inputstr, regexp){
    const matches = [];
    inputstr.replace(regexp, function(...args) {
        const arr = ([]).slice.call(args, 0), extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr);
    });
    return matches.length ? matches : null;
}

/*
 * Shim
 */
if (typeof String.prototype.replaceAll === 'undefined'){
    String.prototype.replaceAll = function(search, replacement){
        return this.replace(new RegExp(search, 'g'), replacement);
    }
}

/*
 * Shim
 */
if (typeof String.prototype.endsWith === 'undefined'){
    String.prototype.endsWith = function(searchString, position){
        const subjectString = this.toString();
        if (position === undefined || position > subjectString.length) position = subjectString.length;
        position -= searchString.length;
        const lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    }
}

const OptimadeNLP = function(){

    /*
     * Definitions
     */
    const stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "u", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"]; /* exact */

    const arity_keys = [null, 'unary', 'binary', 'ternary', 'quaternary', 'quinary', 'multinary', 'multinary', 'multinary', 'multinary', 'multinary']; // NB null is for "0-ary"

    const periodic_elements = ["h", "he", "li", "be", "b", "c", "n", "o", "f", "ne", "na", "mg", "al", "si", "p", "s", "cl", "ar", "k", "ca", "sc", "ti", "v", "cr", "mn", "fe", "co", "ni", "cu", "zn", "ga", "ge", "as", "se", "br", "kr", "rb", "sr", "y", "zr", "nb", "mo", "tc", "ru", "rh", "pd", "ag", "cd", "in", "sn", "sb", "te", "i", "xe", "cs", "ba", "la", "ce", "pr", "nd", "pm", "sm", "eu", "gd", "tb", "dy", "ho", "er", "tm", "yb", "lu", "hf", "ta", "w", "re", "os", "ir", "pt", "au", "hg", "tl", "pb", "bi", "po", "at", "rn", "fr", "ra", "ac", "th", "pa", "u", "np", "pu", "am", "cm", "bk", "cf", "es", "fm", "md", "no", "lr", "rg"]; /* exact */

    const periodic_elements_cased = periodic_elements.map(function(x){ return x[0].toUpperCase() + x.slice(1).toLowerCase() });

    const periodic_element_names = ["hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon", "sodium", "magnesium", "aluminium", "silicon", "phosphorus", "sulfur", "chlorine", "argon", "potassium", "calcium", "scandium", "titanium", "vanadium", "chromium", "manganese", "iron", "cobalt", "nickel", "copper", "zinc", "gallium", "germanium", "arsenic", "selenium", "bromine", "krypton", "rubidium", "strontium", "yttrium", "zirconium", "niobium", "molybdenum", "technetium", "ruthenium", "rhodium", "palladium", "silver", "cadmium", "indium", "tin", "antimony", "tellurium", "iodine", "xenon", "caesium", "barium", "lanthanum", "cerium", "praseodymium", "neodymium", "promethium", "samarium", "europium", "gadolinium", "terbium", "dysprosium", "holmium", "erbium", "thulium", "ytterbium", "lutetium", "hafnium", "tantalum", "tungsten", "rhenium", "osmium", "iridium", "platinum", "gold", "mercury", "thallium", "lead", "bismuth", "polonium", "astatine", "radon", "francium", "radium", "actinium", "thorium", "protactinium", "uranium", "neptunium", "plutonium", "americium", "curium", "berkelium", "californium", "einsteinium", "fermium", "mendelevium", "nobelium", "lawrencium", "roentgenium"]; /* fuzzy */

    const lat_p2i = {'cubic': 1, 'hexagonal': 2, 'trigonal': 3, 'tetragonal': 4, 'orthorhombic': 5, 'monoclinic': 6, 'triclinic': 7, 'rhombohedral': 3, 'cub': 1, 'hex': 2, 'hexag': 2, 'trig': 3, 'tet': 4, 'tetr': 4, 'tetrag': 4, 'orth': 5, 'ortho': 5, 'monocl': 6, 'tric': 7, 'tricl': 7, 'rhom': 3, 'rhomb': 3};
    const lat_fgrs = Object.keys(lat_p2i);
    const lat_i2p = {1:'cubic', 2:'hexagonal', 3:'trigonal', 4:'tetragonal', 5:'orthorhombic', 6:'monoclinic', 7:'triclinic'};

    const mpds_classes = ["ab initio calculations", "ab initio literature", "actinoid", "adamantane", "aegirine", "alkali", "alkaline", "allargentum", "almandine", "alum", "alunogen", "amide", "analcime", "anatase", "anorpiment", "anorthoclase", "antiferroelectric", "antiferromagnet", "antiferromagnetic", "arsenate", "arsenide", "ashcroftine", "auricupride", "aurocupride", "azide", "baileychlore", "bariopyrochlore", "baryte", "beryl", "beta-alumina", "beta-boron", "biguanide", "binary", "birefringent", "borane", "borate", "borax", "boride", "borocarbide", "borohydride", "boronitride", "botryogen", "bromanilate", "bromide", "bromoimide", "calomel", "carbamate", "carbide", "carbonate", "carbonyl", "carboxylate", "celestine", "cell and atoms", "cell-only", "celsian", "cesiokenopyrochlore", "chalcogen", "charge-density wave state", "chevrel", "chimney-ladder", "chloranilate", "chlorate", "chloride", "chloritoid", "chlorosulfate", "chromate", "chrysoberyl", "chrysotile", "cinnabar", "clathrate", "clinochlore", "clinoclase", "clodronate", "close-packed", "cluster glass", "colossal magnetoresistance", "conductor", "corundum", "cosmochlor", "croconate violet", "croconate", "cryptomelane", "cuprate", "cuspidine", "cyamelurate", "cyanamide", "cyanamidonitrate", "cyananilate", "cyanide", "cyanotetrazolate", "cyanoureate", "cyanurate", "cyprine", "davyne", "deuteride", "deuterium", "devilline", "diamagnetic", "diamond", "diarsenate", "diaspore", "diazanide", "diazenide", "dichromate", "digermanate", "diiodobromide", "dinitramide", "diopside", "dioptase", "dioxobromate", "dioxoiodate", "dioxosulfate", "dioxothiosulfate", "diphosphate", "diphosphonate", "dipolyhedral", "diselenate", "disilicate", "disordered", "disulfate", "dithiocarbamate", "dithiocarbonate", "dithionate", "dithiooxalate", "dithiophosphate", "dithiosquarate", "divanadate", "epidote", "euchlorine", "euclase", "eudialyte", "eulytine", "fermi liquid", "feroxihyte", "feroxyhyte", "ferrielectric", "ferrimagnet", "ferroelastic", "ferroelectric", "ferromagnet", "ferromagnetic", "fluor-schorl", "fluoride", "fluoroborate", "frank-kasper", "friauf-laves", "fulleride", "fulminate", "galena", "gamma-brass", "garnet", "giant magnetocaloric effect", "gismondine", "glaucodot", "glaucophane", "grossular", "guanidinate", "gypsum", "hafnon", "half metal", "halogen", "hard magnet", "harmotome", "haueyne", "heavy fermion", "hedyphane", "helimagnet", "helvine", "hexasulfate", "hexathionate", "host-guest", "humboldtine", "hydrate", "hydride", "hydroxide", "hypercinnabar", "hypophosphate", "ice", "imide", "iminate", "intercalation", "intermediate valence", "intermetallic", "iodate", "iodide", "ionic conductor", "iridium", "isoferroplatinum", "isopolyhedral", "isothermal section", "kornerupine", "kosmochlor", "lanthanoid", "lavendulan", "levyne", "lime", "liquidus projection", "litharge", "lithiophosphate", "luminescent", "machine learning", "machine-learning", "magnesiochloritoid", "magnetoelastic", "magnetoelectric", "manganate", "massicot", "mellitate", "melonate", "metacinnabar", "metal", "metalloid", "metamagnet", "metavoltine", "mica", "microcline", "microline", "mictomagnet", "minium", "molybdate", "multiferroic", "multinary", "nasicon", "natron", "natrophosphate", "natroxalate", "negative thermal expansion", "nepheline", "nickeline", "niobocarbide", "niter", "nitranilate", "nitrate", "nitratine", "nitride", "nitroformate", "noble gas", "non disordered", "non-disordered", "non-linear optics", "nonaflate", "nonmetal", "nordenskioeldine", "nosean", "olivine", "optically isotropic", "organic", "orpiment", "orthoborate", "orthoclase", "orthogermanate", "orthonitrate", "orthophosphate", "orthosilicate", "oxalate", "oxamate", "oxide", "oxoiodate", "oxonitrate", "oxotetrazolate", "oxy-schorl", "ozonide", "palladogermanide", "paracelsian", "paramagnet", "pararealgar", "pauli paramagnet", "peer review", "peer reviewed", "peer-review", "peer-reviewed", "perchlorate", "perhydrate", "periclase", "periodate", "permanganate", "pernitride", "peroxide", "pertechnetate", "phosphate", "phosphide", "phosphinate", "phosphonate", "photocatalyst", "photovoltaic effect", "photovoltaic", "piezoelectric", "pnictogen", "polaron conductor", "polycrase", "potassic", "prussian blue", "pseudorutile", "pyrochlore", "pyroelectric", "pyrope", "quadridavyne", "quartz", "quasicrystal", "quaternary", "quinary", "radioactive", "rare earth", "realgar", "refractory", "relaxor", "retzian", "rhodarsenide", "rhodizonate", "rhomboclase", "rocksalt", "rubicline", "ruddlesden-popper", "rutheniridosmine", "rutherfordine", "rutile", "salammoniac", "sanidine", "sapphirine", "sarcopside", "schorl", "selenide", "selenidel", "semiconductor", "semimetal", "shape memory effect", "shape memory", "siderotil", "silanide", "silicate", "silicide", "sillen-aurivillius", "skyrmion", "solidus projection", "solvus projection", "spessartine", "spin glass", "spinel", "spodumene", "squarate", "steenstrupine", "stibarsen", "subsolidus relations", "sulfamate", "sulfamide", "sulfate", "sulfide", "sulfidel", "sulfinylamide", "superconductor", "superhard", "superionic conductor", "superoxide", "talc", "tantalcarbide", "tellurantimony", "telluride", "ternary", "thermoelectric", "thiocyanate", "thiocyanurate", "thiophosphate", "thiosulfate", "topaz", "topological insulator", "tourmaline", "transitional", "triflate", "tripolyhedral", "triteride", "trithionate", "tritide", "tritium", "trona", "tungstate", "turquoise", "ulvoespinel", "unary", "uranophane", "uranopolycrase", "urate", "urea", "ureate", "van vleck paramagnet", "vanadate", "vertical section", "violurate", "xenotime", "zincobotryogen", "zircon", "zircosulfate"];

    const mpds_props = ["acceptor concentration", "acceptor to donor concentration", "activation energy", "adiabatic bulk modulus", "angle-resolved photoelectron spectra", "atomic structure", "band gap", "birefringence", "bremsstrahlung isochromat spectra", "charge carrier concentration", "charge carrier mobility", "charge transfer", "charge-density wave", "charge-transfer energy", "coefficient of schottky term in heat capacity", "coercive electric field", "coercive field", "coherence length", "cohesive energy", "compressibility", "conductivity", "core-electron contribution to magnetic susceptibility", "critical current density", "critical magnetic field", "crystal electric field parameter", "crystal electric field parameters", "crystal electric field splitting", "crystal electric field", "crystal field level", "crystalline structure", "crystal cell", "crystal structure", "curie coefficient", "curie temperature", "curie-weiss paramagnetism", "debye temperature", "decomposition temperature", "decomposition", "diamagnetic contribution to magnetic susceptibility", "dielectric constant", "dielectric loss tangent", "diffusion", "donor concentration", "donor energy", "effective charge", "effective electron number", "effective mass of electrons to holes ratio", "effective mass of electrons", "effective mass", "einstein temperature", "elastic compliance", "elastic moduli", "elastic stiffness coefficient", "elasticity", "electric field gradient", "electric polarization", "electrical conductivity", "electric properties", "electrical properties", "electrical resistivity", "electrochemical impedance spectroscopy", "electron density maps", "electron density of states at fermi level", "electron density of states", "electron energy band structure", "electron energy loss spectra", "electron grueneisen coefficient", "electron mobility", "electron paramagnetic resonance spectra", "electron spin resonance spectra", "electron-phonon interaction parameter", "electronic contribution to heat capacity", "electronic contribution to thermal conductivity", "electronic energy gap", "electronic heat capacity coefficient", "electronic properties", "energy at fermi level", "energy band structure", "energy gap for direct transition", "energy gap for indirect transition", "energy level diagram", "energy of optical phonon", "energy product", "energy", "enthalpy change at melting point", "enthalpy change at phase transition", "enthalpy change at structural transition", "enthalpy change", "enthalpy of formation", "enthalpy of reaction", "enthalpy", "entropy change at melting point", "entropy change at phase transition", "entropy of formation", "entropy of reaction", "entropy", "eutectoid decomposition", "exchange field", "exchange interaction parameter", "exciton energy", "extended x-ray absorption fine structure", "extraordinary refractive index", "fermi energy", "fermi surface", "ferroelasticity", "ferroelectric curie temperature", "ferroelectric hysteresis", "ferroelectric neel temperature", "ferroelectric transitions", "field dependence of resistivity", "figure of merit", "freezing temperature for spin glass", "fusion", "gibbs energy change", "gibbs energy of formation", "gibbs energy of reaction", "ginzburg-landau parameter", "grueneisen coefficient", "gruneisen coefficient", "hall coefficient", "hall effect", "hall mobility", "hardness", "heat capacity at constant pressure", "heat capacity at constant volume", "heat capacity coefficient", "heat capacity discontinuity at structural transition", "heat capacity discontinuity at superconducting transition", "heat capacity discontinuity", "heat capacity", "high-frequency permittivity", "hole mobility", "hydrogen diffusion", "hyperfine magnetic field", "imaginary part of magnetic susceptibility", "imaginary part of permittivity", "inelastic neutron scattering", "inelastic x-ray scattering", "infrared spectra", "ionic conductivity", "irreversibility field", "isomer shift", "isothermal bulk modulus", "isothermal linear compressibility", "isothermal volume compressibility", "knoop hardness", "kondo behavior", "kondo temperature", "lattice", "linear magnetostriction", "linear thermal expansion coefficient", "longitudinal sound velocity", "longitudinal-mode elastic coefficient", "lorentz number", "lower critical magnetic field", "lowest temperature of investigation", "luminescence lifetime", "luminescence", "magnetic anisotropy field", "magnetic anisotropy", "magnetic circular x-ray dichroism", "magnetic dichroism", "magnetic direction", "magnetic entropy", "magnetic field for magnetic transition", "magnetic field for structural transition", "magnetic heat capacity", "magnetic hysteresis", "magnetic moment", "magnetic order", "magnetic penetration depth", "magnetic phase diagram", "magnetic properties", "magnetic resistivity", "magnetic structure", "magnetic susceptibility", "magnetic transitions", "magnetism", "magnetization", "magneto-optical effects", "magneto-optical kerr effect", "magnetostriction", "mechanical properties", "melting temperature", "microhardness", "moessbauer spectra", "mohs hardness", "molar volume", "molecular field parameter", "muon spin spectra", "neel temperature", "neutron energy loss spectra", "non-linear optical properties", "non-linear optics", "nuclear magnetic resonance spectra", "nuclear quadrupolar resonance spectra", "optical absorption coefficient", "optical absorption", "optical conductivity", "optical phonons", "optical properties", "optical spectra", "orbital magnetic moment", "ordinary refractive index", "paraelectric curie coefficient", "paraelectric curie temperature", "paraelectric state", "paramagnetic curie temperature", "paramagnetic moment", "pauli magnetic susceptibility", "peritectic formation", "peritectoid formation", "permittivity", "perturbed angular correlation", "phase diagram", "phase transitions", "phonon contribution to thermal conductivity", "phonon density of states", "phonon dispersion", "phonon grueneisen coefficient", "phonon heat capacity at constant pressure", "phonons", "photo-conductivity data", "photo-conductivity", "photoelectron emission spectra", "photoluminescence spectra", "physical properties", "piezoelectric coefficient", "piezoelectric coefficient", "piezoelectricity", "plasma edge", "poisson ratio", "power factor", "pressure derivative of adiabatic bulk modulus", "pressure derivative of curie temperature", "pressure derivative of elastic stiffness coefficient", "pressure derivative of energy gap", "pressure derivative of isothermal bulk modulus", "pressure derivative of neel temperature", "pressure derivative of superconducting transition temperature", "pressure derivative of transition temperature", "pressure for magnetic transition", "pressure for metal-nonmetal transition", "pressure for structural transition", "pyroelectric coefficient", "pyroelectricity", "quadrupole splitting", "raman spectra", "real part of magnetic permeability", "real part of magnetic susceptibility", "real part of optical conductivity", "real part of permittivity", "reflectivity", "refractive index", "relative cooling power", "remanent induction", "remanent magnetic field", "remanent magnetic moment", "remanent magnetization", "remanent polarization", "residual resistivity ratio", "residual resistivity", "resistivity anisotropy", "resistivity", "resonance spectra", "saturation magnetic moment", "saturation magnetization", "second-harmonic generation", "seebeck coefficient", "shear modulus", "soft-x-ray emission spectra", "sound velocity", "spin contribution to magnetic susceptibility", "spin magnetic moment", "spin-fluctuation temperature", "spin-fluctuation", "spin-orbit splitting of valence band", "spin-resolved electron density of states at fermi level", "spontaneous elastic strain", "spontaneous magnetic moment", "spontaneous magnetization", "spontaneous polarization", "static permittivity", "stoner enhancement factor", "stoner parameter", "stoner product", "structural transition", "structural transitions", "superconducting transition temperature", "superconductivity energy gap", "superconductivity phenomena", "superconductivity", "temperature dependence of resistivity", "temperature dependence of static permittivity", "temperature derivative of elastic stiffness coefficient", "temperature derivative of energy gap", "temperature derivative of resistivity", "temperature derivative of upper critical magnetic field", "temperature for congruent melting", "temperature for eutectoid decomposition", "temperature for ferroelectric reordering", "temperature for magnetic transition", "temperature for metal-nonmetal transition", "temperature for peritectic formation", "temperature for peritectoid formation", "temperature for structural transition", "temperature-independent part of magnetic susceptibility", "thermal cell parameters change", "thermal conductivity", "thermal energy gap", "thermal expansion", "thermal properties", "thermal strain", "thermodynamic properties", "thermodynamics", "thermoelectric figure of merit", "thermoelectric power", "total energy calculation data", "transmittance", "transverse sound velocity", "type of magnetism", "upper critical magnetic field", "vacuum ultraviolet photoemission spectra", "valence", "van vleck contribution to magnetic susceptibility", "vibrational spectra", "vickers hardness number", "volume change at phase transition", "volume change at structural transition", "volume change", "volume magnetostriction", "volume thermal expansion coefficient", "wavelength for luminescence", "wavenumber of longitudinal optical phonon", "wavenumber of optical phonon", "wavenumber of transverse optical phonon", "work function", "x-ray absorption near-edge spectra", "x-ray absorption spectra", "x-ray photoemission spectra", "young modulus"];

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
        if (input.includes('&#')) charred = true;
        const re = charred ? /&#x208(\d);/g : /%u208(\d)/g;
        input = charred ? input : escape(input);
        const matches = getMatchAll(input, re);
        if (matches){
            for (let i = 0; i < matches.length; i++){
                input = input.replace(matches[i][0], matches[i][1]);
            }
        }
        return unescape(input).replace(/^\(|\)$/g, "");
    }

    /*
     * User input processing: brute-force similarity check
     */
    function is_like_chem_formula(chk){
        //console.log('Checking formula');
        const len = chk.length;

        let checks;

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

        for (let i = 0; i < checks.length; i++){
            let signals = 0;
            for (let j = 0; j < checks[i].length; j++){
                if (periodic_elements_cased.includes(checks[i][j]))
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

        const maybe_formula = !is_numeric(term.charAt(0));

        const dmatches = getMatchAll(term, /(\d)/g);
        if (dmatches && dmatches.length > 1 && maybe_formula)
            return ['formulae']; // no props with more than one digit

        const imatches = getMatchAll(escape(term), /%u208(\d)/g);
        if (imatches && imatches.length && maybe_formula)
            return ['formulae']; // no props with subscripts

        if (periodic_elements.includes(term)) return ['elements'];
        else if (periodic_element_names.includes(term)) return ['elements', periodic_elements[ periodic_element_names.indexOf(term) ]];

        if (term.includes('-')){
            const parts = term.split('-');
            let excl = false;
            parts.forEach(function(part){
                if (!periodic_elements.includes(part)) excl = true;
            });
            if (!excl) return ['elements'];
        }

        if (['element', 'elements', 'elementary'].includes(term)) return ['classes', 'unary'];
        else if (term == 'quinternary' || term == 'quinternaries' || term == 'quinaries' || term == 'pentanary' || term == 'pentanaries') return ['classes', 'quinary'];
        else if (term == 'actinide' || term == 'actinides') return ['classes', 'actinoid'];
        else if (term == 'lantanide' || term == 'lantanides' || term == 'lanthanide' || term == 'lanthanides' || term == 'lantanoid' || term == 'lantanoids') return ['classes', 'lanthanoid'];
        else if (term.endsWith('ite') && term.length > 4) return ['classes'];

        const chk = term.replace(' structure', '').replace(' lattice', '').replace(' crystalline', '').replace(' crystal', '');
        if (lat_fgrs.includes(chk)) return ['lattices', lat_i2p[ lat_p2i[chk] ]];

        if (term.length <= 9 && dmatches && maybe_formula) return ['formulae']; // no SHORT props with digits (NB L0, E1)

        return false;
    }

    /*
     * Detect facets: classes, props
     */
    function try_multiword_facet(term, queue){
        term = term.toLowerCase();

        let candidate = false, combined = false, orig = false;

        if (queue.length){
            orig = term;
            combined = true;
            queue.forEach(function({input}) {
                term = `${input} ${term}`;
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

        let single_chk;
        if (term.endsWith('s')){ // plural-singular fixups
            single_chk = term.substr(0, term.length-1);

            if (!combined && single_chk.endsWith('ite')) return {'facet': 'classes', 'input': single_chk, 'ready': 1};

            candidate = check_category(single_chk, 'classes');
            if (candidate){
                if (combined) candidate.combined = true;
                return candidate;
            }
        }
        if (term.endsWith('es')){ // plural-singular fixups
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
        const host = (category == 'classes') ? mpds_classes : mpds_props;

        if (host.includes(term)) return {'facet': category, 'input': term, 'ready': 1};

        let i = 0;
        const len = host.length;
        const re = new RegExp(`(?:^|\\s)(${term})(?=\\s|$)`);
        let idx;
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
        const detect = new RegExp(/A(\d{0,3})B(\d{0,3})(C(\d{0,3})(D(\d{0,3}))?)?\b/);
        return formula.charAt(0) === 'A' && detect.test(formula);
    }

    /*
     * User input processing: main algorithm
     */
    function guess(inputstr){
        // *pseudo_numerics*
        if (inputstr.includes('c/a ') || inputstr.includes('a/b ') || inputstr.includes('b/c ')){ // FIXME slashes in names
            if (inputstr.includes('c/a ')) inputstr = inputstr.replace('c\/a ', 'c--a ');
            if (inputstr.includes('a/b ')) inputstr = inputstr.replace('a\/b ', 'a--b ');
            if (inputstr.includes('b/c ')) inputstr = inputstr.replace('b\/c ', 'b--c ');
        }

        const tokens = inputstr
                .replace(new RegExp('\\+|\\!|\\?', 'g'), '')
                .replace(new RegExp(',|/', 'g'), ' ')
                .replace(new RegExp('\<', 'g'), ' < ')
                .replace(new RegExp('\>', 'g'), ' > ')
                .replace(new RegExp('=', 'g'), ' = ').split(/\s+/);

        const result = {};
        let n_terms = 0;
        let n_toks = 1;
        let queue = [];
        const ignored = [];
        //console.log(tokens);
        // TODO: gracefully discard brackets

        tokens.forEach(function(input){
            let facet = false, simple = false;
            input = input.trim();

            if (input.includes('<') || input.includes('>') || input.includes('=') || is_numeric(input)){ // numeric searches
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
                if (queue.length && !queue[queue.length - 1].ready) ignored.push( ...queue.map(function(obj){ return obj.input }) );
                queue = [];
                //console.log(input + ": found simple facet " + simple[0]);

            } else {
                if (!stop_words.includes(input)){
                    input = input
                        .replace(new RegExp("\\(", 'g'), "")
                        .replace(new RegExp("\\)", 'g'), "")
                        .replace(new RegExp("\\[", 'g'), "")
                        .replace(new RegExp("\\]", 'g'), "");

                    const candidate = try_multiword_facet(input, queue);
                    //console.log(candidate);

                    if (candidate.combined) queue = [];

                    if (candidate.ready){ // term found either alone or with previous
                        facet = candidate.facet;
                        input = candidate.input;
                        queue = [ candidate ];

                    } else if (candidate.anew){ // token anew
                        if (queue.length && !queue[queue.length-1].ready) ignored.push( ...queue.map(function(obj){ return obj.input }) );
                        queue = [ candidate ];

                    } else if (!candidate){ // token unknown
                        if (queue.length && !queue[queue.length-1].ready) ignored.push( ...queue.map(function(obj){ return obj.input }) );
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
                if (queue.length && !queue[queue.length-1].ready) ignored.push( ...queue.map(function(obj){ return obj.input }) );
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
                        result[facet] += `-${input}`;

                    } else if (facet == "classes"){
                        result[facet] += `, ${input}`; //escape(input);

                    } else if (facet == "props"){
                        if (input.includes(result[facet])){
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

        const filter = [];

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
                    const arity = arity_keys.indexOf(item);
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
};

if (typeof module !== 'undefined' && module.exports){
    module.exports = OptimadeNLP;
} else if (typeof require === 'function' && typeof require.specified === 'function'){
    define(function(){ return OptimadeNLP });
}
