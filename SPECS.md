# SPECS.md — Cahier des Charges GestioPro
**Fondateur & CEO : HAZOUME CLARENCE ALVIN**
**Email : hazoumeclarence@gmail.com**
**Téléphone : +229 56 50 13 48**
**Ville : Cotonou, Bénin**
**Date : Avril 2026**
**Version : 1.0**

---

## 1. VISION DU PROJET

GestioPro est une plateforme SaaS de gestion multi-secteurs conçue pour les PME d'Afrique de l'Ouest. Elle permet à chaque entreprise de gérer sa comptabilité, ses stocks, ses ventes et ses rapports depuis un seul et unique outil, adapté à son secteur d'activité.

**Mission :** Rendre la gestion professionnelle accessible à chaque PME d'Afrique de l'Ouest, quel que soit son secteur, sa taille ou son niveau de formation.

**Modèle :** SaaS par abonnement mensuel (Freemium → Pro → Business → Entreprise)

---

## 2. STRATÉGIE MVP

> **Règle d'or : Ne pas tout mettre dès le début. Lancer simple, valider, puis scaler.**

### Phase 1 — MVP (Lancement)
- **Secteur unique : Commerce / Retail**
- **Modules : Dashboard + Ventes + Produits + Stock + Clients + Rapports**
- **Objectif : 50 premiers clients payants au Bénin**

### Phase 2 — Expansion (Mois 4–6)
- Agriculture + Santé
- Paiement Mobile Money intégré
- Application Android (Play Store)

### Phase 3 — Croissance (Mois 7–12)
- 4 secteurs supplémentaires
- Dashboard multi-secteurs consolidé
- Expansion régionale : Togo, Sénégal, Côte d'Ivoire

---

## 3. MODULES STANDARD (POUR TOUS LES SECTEURS)

> Ces modules sont présents sur tous les comptes, quel que soit le secteur choisi.

### 3.1 Dashboard (Tableau de bord)
- Chiffre d'affaires du jour
- Nombre de transactions
- Bénéfice net et marge
- Alertes intelligentes (stock, dettes, marge basse)
- Graphique des 7 derniers jours et 30 jours
- Accès rapide aux actions fréquentes

### 3.2 Ventes / Transactions
- Enregistrement rapide d'une vente
- Prix d'achat et prix de vente
- Calcul automatique du bénéfice et de la marge
- Mode de paiement : Cash, Mobile Money, Carte, Crédit
- Date et heure automatiques
- Génération ticket caisse (PDF ou impression Bluetooth)

### 3.3 Produits / Services
- Nom du produit ou service
- Prix d'achat fournisseur
- Prix de vente
- Catégorie
- Stock disponible
- Photo du produit (optionnel)
- Code produit / SKU (optionnel)

### 3.4 Stock / Inventaire
- Quantité disponible en temps réel
- Alertes automatiques de rupture de stock
- Historique complet des mouvements
- Valeur totale du stock
- Seuil minimum personnalisable

### 3.5 Clients
- Nom et prénom
- Numéro de téléphone
- Historique des achats
- Gestion des dettes (créances)
- Solde dû et versements effectués

### 3.6 Paiements
- Cash
- Mobile Money (MTN, Moov, Wave)
- Carte bancaire
- Crédit (paiement différé)
- Historique complet des paiements

### 3.7 Rapports Automatiques
- Rapport journalier
- Rapport hebdomadaire
- Rapport mensuel
- Export PDF (téléchargeable en 1 clic)
- Export Excel (téléchargeable en 1 clic)
- Rapport par produit
- Rapport par client

### 3.8 Ticket de Caisse
- Numéro de reçu unique
- Nom de l'entreprise et logo
- Produit vendu, quantité, prix unitaire
- Total payé et mode de paiement
- Date et heure
- QR code de vérification (optionnel)
- Formats : PDF, Impression Bluetooth 58mm, WhatsApp, PNG

### 3.9 Utilisateurs & Rôles
- Admin : accès total
- Gérant : ventes + stock + rapports
- Vendeur : ventes uniquement
- Lecteur : rapports uniquement (lecture seule)
- Toutes les actions sont tracées et historisées

### 3.10 Paramètres
- Informations de l'entreprise
- Logo de l'entreprise
- Devise (FCFA, EUR, USD...)
- Langue (Français, Anglais...)
- Notifications et alertes

### 3.11 Alertes Intelligentes
- Stock faible ou en rupture
- Dettes clients non réglées
- Baisse de marge sous un seuil fixé
- Rappel de réapprovisionnement
- Notifications push (mobile)

### 3.12 Notifications
- Centre de notifications complet
- Historique de toutes les alertes
- Notifications push sur mobile
- Email de résumé journalier (optionnel)

### 3.13 Mode Hors Ligne
- Fonctionne sans connexion Internet
- Données sauvegardées localement
- Synchronisation automatique au retour de la connexion
- Essentiel pour l'Afrique de l'Ouest

### 3.14 Multi-Devises
- FCFA (principal)
- Euro, Dollar, Naira...
- Conversion automatique selon le taux du marché
- Utile pour les commerçants avec fournisseurs internationaux

---

## 4. PERSONNALISATION PAR ENTREPRISE

> Innovation centrale de GestioPro : chaque entreprise peut adapter l'outil à sa réalité unique.

### Concept
- Chaque compte a les modules standard activés par défaut
- Dans **Paramètres > Mes fonctionnalités**, l'utilisateur active des modules optionnels
- Il peut créer des champs personnalisés : texte, nombre, date, liste déroulante
- Ces champs apparaissent dans les formulaires et les rapports
- GestioPro propose un catalogue de modules métiers à activer

### Exemples concrets
| Entreprise A | Entreprise B |
|---|---|
| Fermier Bob : produits, récoltes, ventes | Fermier Jacob : idem + machines agricoles, entretien, coûts carburant |
| Assurance Alpha : contrats, primes, sinistres | Assurance Bêta : idem + assurances à crédit, suivi dettes clients |
| Clinique Sainte-Marie : patients, consultations | Pharmacie Centrale : idem + ordonnances, prescriptions récurrentes |

---

## 5. MODULES PAR SECTEUR

### 5.1 Commerce / Retail (Phase 1)
- Gestion fournisseurs
- Caisse journalière
- Promotions et réductions
- Retours produits
- Codes produits (SKU)
- Historique des prix d'achat fournisseur

### 5.2 Agriculture (Phase 1)
- Récoltes (type, quantité, date)
- Coûts de production (engrais, main d'œuvre)
- Machines agricoles (custom)
- Suivi des saisons
- Pertes agricoles
- Ventes saisonnières

### 5.3 Santé / Clinique (Phase 2)
- Enregistrement des patients
- Nature des consultations
- Prescriptions et médicaments
- Dossiers médicaux
- Rendez-vous
- Facturation des soins

### 5.4 Restauration (Phase 2)
- Menu et plats
- Ingrédients et coûts par plat
- Gestion des tables
- Commandes en cours
- Statut cuisine
- CA par plat et par service

### 5.5 Éducation (Phase 2)
- Élèves inscrits
- Classes et niveaux
- Frais de scolarité
- Paiements et retards
- Présences et absences
- Bulletins de notes

### 5.6 Transport / Logistique (Phase 3)
- Flotte de véhicules
- Chauffeurs
- Trajets effectués
- Carburant consommé
- Maintenance et pannes
- Revenus par trajet

### 5.7 BTP / Construction (Phase 3)
- Chantiers en cours
- Matériaux et quantités
- Main d'œuvre
- Budget vs dépenses réelles
- Avancement des travaux
- Fournisseurs BTP

### 5.8 Services / Salons (Phase 3)
- Clients et prestations
- Produits utilisés
- CA par prestation
- Agenda et rendez-vous
- Fidélité clients
- Employés et commissions

### 5.9 Hôtellerie (Phase 3)
- Chambres et disponibilités
- Réservations clients
- CA par chambre
- Services additionnels
- Nettoyage et maintenance
- Partenaires et agences

### 5.10 Assurance (Phase 3)
- Contrats et clients
- Primes perçues
- Sinistres déclarés
- Assurances à crédit (custom)
- Relances automatiques impayés
- Rapports réglementaires

---

## 6. MODULES TRANSVERSAUX (PHASE FUTURE)

> À ajouter après validation du marché pour devenir la référence.

### 6.1 Analytics Avancé
- Produits les plus rentables
- Clients les plus actifs
- Prévisions de ventes (IA)
- Détection d'anomalies

### 6.2 Mobile Money Intégré
- Paiement direct depuis l'app
- MTN Mobile Money, Moov, Wave
- Suivi automatique des transactions
- Réconciliation bancaire

### 6.3 Crédit / Financement
- Scoring client basé sur l'historique
- Suivi des prêts
- Remboursements
- Alertes de retard

### 6.4 Marketplace Fournisseurs
- Commander du stock directement depuis l'app
- Comparer les fournisseurs
- Paiements B2B intégrés
- Historique des commandes

### 6.5 Module RH
- Gestion des employés
- Salaires et paie
- Présences et congés
- Évaluations de performance

### 6.6 Assistant IA
- Conseil de gestion personnalisé
- Prévisions de stock automatiques
- Suggestions de prix optimaux
- Alertes proactives

---

## 7. STACK TECHNIQUE

### Frontend
- **Next.js** + **React.js**
- **Tailwind CSS**
- **Axios** (appels API)
- **React Router DOM** (navigation)

### Backend
- **Node.js** + **Express.js**
- **JWT + bcrypt** (authentification)
- **Prisma** (ORM)

### Base de données
- **PostgreSQL** (via Supabase)

### Hébergement
- **Render** (gratuit au démarrage)
- **DigitalOcean** (à la croissance)
- **Cloudinary** (stockage images)

### Performance
- **Redis** (cache — Phase 2)
- **Cloudflare CDN** (Phase 2)
- **Socket.IO** (temps réel — Phase 2)

---

## 8. MODÈLE ÉCONOMIQUE

| Plan | Prix | Utilisateurs | Secteurs |
|---|---|---|---|
| Gratuit | 0 FCFA/mois | 1 | 1 (limité) |
| Pro | 5 000 FCFA/mois | 3 | 1 complet |
| Business | 12 000 FCFA/mois | 10 | 3 |
| Entreprise | Sur devis | Illimité | Illimité |

**Réduction annuelle : -20%**

---

## 9. RÈGLES DE DÉVELOPPEMENT

- Un secteur à la fois — ne pas disperser
- Tester avec de vrais utilisateurs avant de passer au suivant
- Commit après chaque fonctionnalité terminée
- Une branche par fonctionnalité (`feature/nom`)
- Ne jamais pousser du code cassé sur `main`
- Documenter chaque API créée

---

## 10. VISION 2030

| Année | Objectif |
|---|---|
| 2026 | Lancement Bénin — 50 clients Commerce |
| 2027 | 10 secteurs — 1 000 clients — Togo, Sénégal |
| 2028 | IA intégrée — 5 000 clients — Cameroun, Mali |
| 2029 | Marketplace fournisseurs — 20 000 clients |
| 2030 | 15 pays africains — 100 000 PME actives |

---

*Document rédigé par HAZOUME CLARENCE ALVIN — Fondateur GestioPro*
*Cotonou, Bénin — Avril 2026*
*hazoumeclarence@gmail.com — +229 56 50 13 48*