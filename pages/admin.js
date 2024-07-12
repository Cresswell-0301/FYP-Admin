import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Title from "@/components/Title";
import { withSwal } from "react-sweetalert2";

function Admin({ swal }) {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  function fetchAdmins() {
    axios.get("/api/admin").then((response) => {
      setAdmins(response.data);
    });
  }

  function deleteAdmin(admin) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${admin.username}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { email } = admin;
          await axios.delete("/api/admin?email=" + email);
          fetchAdmins();
        }
      });
  }

  return (
    <Layout>
      <Title>Manage Admin</Title>
      <div className="w-[100%] h-auto p-4">
        <div className="flex w-fit ml-auto mr-0">
          <Link className="btn-primary" href={"/admin/add"}>
            Add Admin
          </Link>
        </div>
        <div className="h-auto w-[100%] mt-5 border-gray-400">
          <table className="product mt-2">
            <thead>
              <tr>
                <td className="text-black">Admin list</td>
              </tr>
            </thead>
            <tbody>
              {admins.slice(1).map((admin) => (
                <tr key={admin._id}>
                  <td className="text-black">{admin.username}</td>
                  <td className="text-black">{admin.email}</td>
                  <td className="text-end">
                    <Link
                      className="btn-default"
                      href={"/admin/edit/" + admin._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit
                    </Link>
                    <button
                      className="bg-red-700 text-white rounded-lg px-4 inline-flex mx-1 items-center gap-1 text-sm py-1"
                      href={"/admin/delete/" + admin._id}
                      onClick={() => deleteAdmin(admin)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Admin swal={swal} />);
