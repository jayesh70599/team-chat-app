const MemberSidebar = ({ members, currentUser }) => {
  return (
    <div className="w-56 bg-white border-l border-gray-200 flex-shrink-0 hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Members — {members.length}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-3">
          {members.map((member) => (
            <li key={member._id} className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <span className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white ${member.isOnline ? "bg-green-500" : "bg-gray-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.username} {member._id === currentUser._id && <span className="text-gray-400 font-normal">(You)</span>}
                </p>
                <p className="text-xs text-gray-500 truncate">{member.isOnline ? "Online" : "Offline"}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MemberSidebar;