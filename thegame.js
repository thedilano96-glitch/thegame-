// Class User Management & Internationalization / Currency Conversion
class UserProfile {
    constructor() {
        this.country = 'CM'; // Détection par défaut (Cameroun)
        this.currency = 'XAF';
        this.language = 'fr';
        
        // Dictionnaire des devises et taux de conversion (Base USD)
        this.currencies = {
            'XAF': { symbol: 'FCFA', rate: 600, format: (val) => `${Math.round(val).toLocaleString('fr-FR')} XAF` },
            'EUR': { symbol: '€', rate: 0.92, format: (val) => `${val.toFixed(2)} €` },
            'USD': { symbol: '$', rate: 1.0, format: (val) => `$${val.toFixed(2)}` },
            'GBP': { symbol: '£', rate: 0.79, format: (val) => `£${val.toFixed(2)}` }
        };

        // Textes multilingues
        this.translations = {
            'fr': {
                'welcome': "Bienvenue dans The Game !",
                'play': "Jouer",
                'buy_coins': "Acheter 100 Pièces",
                'earn_money': "Gagner de l'argent"
            },
            'en': {
                'welcome': "Welcome to The Game!",
                'play': "Play Now",
                'buy_coins': "Buy 100 Coins",
                'earn_money': "Earn Money"
            }
        };

        this.initLocation();
    }

    // Détection automatique du pays / langue via IP
    async initLocation() {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.country_code) {
                this.country = data.country_code;
                if (data.country_code === 'CM' || data.currency === 'XAF') {
                    this.currency = 'XAF';
                    this.language = 'fr';
                } else if (data.currency && this.currencies[data.currency]) {
                    this.currency = data.currency;
                    this.language = data.languages ? data.languages.split(',')[0].substring(0, 2) : 'en';
                }
            }
        } catch (e) {
            console.log("Utilisation des paramètres par défaut (Cameroun / FCFA)");
        }
    }

    // Obtenir un texte traduit
    getText(key) {
        const lang = this.translations[this.language] ? this.language : 'fr';
        return this.translations[lang][key] || key;
    }

    // Convertir et formater un prix en USD vers la devise locale
    formatPrice(amountInUSD) {
        const curr = this.currencies[this.currency] || this.currencies['XAF'];
        const converted = amountInUSD * curr.rate;
        return curr.format(converted);
    }

    get currencyInfo() {
        return this.currencies[this.currency] || this.currencies['XAF'];
    }
}

// Initialisation globale de l'application
window.gameInstance = {
    user: new UserProfile()
};
