import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const BusinessInfoContext = createContext({ businessInfo: null, loading: true });

export const useBusinessInfo = () => useContext(BusinessInfoContext);

export const BusinessInfoProvider = ({ children }) => {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = "BDPGvyvz8w0mAI8PIPjw";

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const docRef = doc(db, "businessInfo", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBusinessInfo({ id: docSnap.id, ...docSnap.data() });
        } else {
          setBusinessInfo(null);
        }
      } catch (error) {
        setBusinessInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [id]);

  return (
    <BusinessInfoContext.Provider value={{ businessInfo, loading }}>
      {children}
    </BusinessInfoContext.Provider>
  );
};
