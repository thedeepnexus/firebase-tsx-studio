/**
 * Firebase Admin App
 */
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { getApps, ServiceAccount } from "firebase-admin/app";
import admin from "firebase-admin";
import { Auth, getAuth } from "firebase-admin/auth";

const serviceAccount = {
  type: "service_account",
  project_id: "next-tsx-studio",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40next-tsx-studio.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

let firestore: Firestore;
let auth: Auth;
const currentApps = getApps();

if (!currentApps.length) {
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
  firestore = getFirestore(app);
  auth = getAuth(app);
} else {
  const app = currentApps[0];
  firestore = getFirestore(app);
  auth = getAuth(app);
}

export { firestore, auth };

// Firestore에서 총 문서 개수를 가져와 페이지 개수를 계산하는 함수
export const getTotalPages = async (
  firestoreQuery: FirebaseFirestore.Query<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >, // Firestore에서 실행할 쿼리 (검색 조건 포함)
  pageSize: number // 한 페이지에 표시할 문서 개수
) => {
  // Firestore의 count() 메서드를 사용하여 총 문서 개수를 가져옴
  const queryCount = firestoreQuery.count();

  // count()의 결과를 가져옴 (쿼리를 실행하여 문서 개수 조회)
  const countSnapshot = await queryCount.get();

  // countSnapshot에서 데이터를 추출
  const countData = countSnapshot.data();

  // 문서 총 개수 (count 필드에서 가져옴)
  const total = countData.count;

  // 전체 문서 개수를 pageSize로 나누어 총 페이지 개수를 계산
  const totalPages = Math.ceil(total / pageSize);

  // 총 페이지 수 반환
  return totalPages;
};
