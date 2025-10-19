/* eslint-disable max-len */ // Tymczasowo wyłącz regułę max-len dla komentarzy

// Import modułów Firebase Functions i Firebase Admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Zainicjalizuj Firebase Admin SDK.
// Cloud Functions automatycznie pobierze konfigurację z Twojego projektu Firebase.
admin.initializeApp();

/**
 * Ustawia custom claim 'groupId' dla podanego użytkownika.
 * Ta funkcja jest wywoływana z Twojej aplikacji (pliku index.html).
 *
 * @param {object} data - Dane przekazane z aplikacji. Powinny zawierać:
 * - targetUserId: ID użytkownika, któremu ustawiamy claim.
 * - groupId: ID grupy, którą ustawiamy jako claim.
 * @param {functions.https.CallableContext} context - Kontekst wywołania, zawiera m.in. dane uwierzytelniające użytkownika wywołującego.
 * @returns {Promise<{success: boolean, message: string}>} - Obiekt z informacją o sukcesie lub błędzie.
 */
exports.setUserGroupClaim = functions.https.onCall(async (data, context) => {
  // --- Zabezpieczenie 1: Sprawdź, czy użytkownik wywołujący jest zalogowany ---
  if (!context.auth) {
    // Jeśli nie, odrzuć żądanie z błędem 'unauthenticated'
    throw new functions.https.HttpsError(
      "unauthenticated", // Kod błędu
      "Musisz być zalogowany, aby wykonać tę operację.", // Komunikat błędu
    );
  }

  // --- Pobierz dane wejściowe ---
  const targetUserId = data.targetUserId; // ID użytkownika, którego claim modyfikujemy
  const groupIdToSet = data.groupId; // ID grupy do ustawienia w claimie

  // --- Zabezpieczenie 2: Sprawdź, czy przekazano wymagane dane ---
  if (!targetUserId || !groupIdToSet) {
    throw new functions.https.HttpsError(
      "invalid-argument", // Kod błędu
      "Brakuje wymaganych danych: ID użytkownika (targetUserId) lub ID grupy (groupId).", // Komunikat błędu
    );
  }

  // --- Zabezpieczenie 3 (BARDZO WAŻNE - DO IMPLEMENTACJI!): Sprawdź uprawnienia ---
  // TODO: Dodaj tutaj logikę sprawdzającą, CZY użytkownik wywołujący (context.auth.uid)
  // MA PRAWO ustawić claim dla użytkownika 'targetUserId'.
  // Przykłady:
  // - Czy jest administratorem grupy 'groupIdToSet'?
  // - Czy 'targetUserId' to ten sam użytkownik co 'context.auth.uid' (jeśli pozwalamy na samodzielne przypisanie)?
  // const isAuthorized = await checkIfUserIsAdmin(context.auth.uid, groupIdToSet);
  // if (!isAuthorized) {
  //   throw new functions.https.HttpsError(
  //     "permission-denied",
  //     "Nie masz uprawnień, aby ustawić claim dla tego użytkownika."
  //   );
  // }
  console.warn(
    `UWAGA: Funkcja setUserGroupClaim nie ma jeszcze pełnej weryfikacji uprawnień! Użytkownik ${context.auth.uid} próbuje ustawić claim dla ${targetUserId}.`,
  );

  // --- Główna logika: Ustawienie Custom Claim ---
  try {
    // Użyj Admin SDK, aby ustawić (lub nadpisać) custom claims dla danego użytkownika.
    // Przekazujemy obiekt, gdzie kluczem jest nazwa claimu ('groupId'), a wartością jest ID grupy.
    await admin.auth().setCustomUserClaims(targetUserId, { groupId: groupIdToSet });

    // Wysłanie komunikatu o sukcesie z powrotem do aplikacji
    console.log(
      `Pomyślnie ustawiono groupId=${groupIdToSet} dla użytkownika ${targetUserId}`,
    );
    return { success: true, message: "Claim grupy został pomyślnie ustawiony." };
  } catch (error) {
    // Obsługa błędów, np. jeśli podane targetUserId nie istnieje
    console.error(
      `Krytyczny błąd podczas ustawiania claimu dla ${targetUserId}:`, error,
    );
    // Wysłanie błędu z powrotem do aplikacji
    throw new functions.https.HttpsError(
      "internal", // Ogólny kod błędu serwera
      "Wystąpił nieoczekiwany błąd serwera podczas ustawiania claimu.", // Komunikat błędu
    );
  }
});

// Możesz tutaj dodać inne Cloud Functions w przyszłości, np.:
// exports.innaFunkcja = functions.https.onCall(async (data, context) => { ... });
// exports.onUserCreate = functions.auth.user().onCreate(async (user) => { ... });
